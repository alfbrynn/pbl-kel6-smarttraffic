// =====================================================
// smartraf-bridge v3.5
// VM: vm-kelompok-6-2026
//
// Perubahan dari v2.4:
//   - Field disesuaikan dengan payload Master terbaru:
//     jumlah_masuk, sudah_lewat, sisa_antrian
//   - Fix: serverTimestamp() tidak disimpan di buffer lokal
//   - Fix: handler sisa_antrian disimpan ke Firestore
//   - Hapus ATUR_DURASI otomatis (konflik dengan adaptif Arduino)
//   - Pertahankan: batch write tiap 3 detik (hemat kuota)
// =====================================================

const mqtt = require('mqtt');
const admin = require('firebase-admin');

// ─────────────────────────────────────────────────────
// INISIALISASI FIREBASE
// ─────────────────────────────────────────────────────
admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
});
const db = admin.firestore();

// ─────────────────────────────────────────────────────
// STATE & CACHE
// ─────────────────────────────────────────────────────
let configSimpang = {
    status_darurat: 'OFF',
    pengaturan_manual: { jarak_padat_cm: 30, min_hijau_detik: 15, max_hijau_detik: 60 }
};

let daruratSudahDikirim = false;
let isFirestoreListening = false;
const lastLogTime = {};   // throttle histori per jalur (1 menit)
const lastWrittenData = {};  // cache untuk dirty check

// ─────────────────────────────────────────────────────
// BUFFER BATCH WRITE — hemat kuota Firestore
//
// FIX: simpan data jalur tanpa serverTimestamp() di buffer.
// serverTimestamp() ditambahkan saat actual write ke Firestore.
// ─────────────────────────────────────────────────────
let bufferJalur = {};   // { barat: {...}, timur: {...}, selatan: {...} }
let bufferSisa = {};   // { barat: {...}, timur: {...}, selatan: {...} }
let isBufferDirty = false;

// Worker batch write tiap 3 detik
setInterval(async () => {
    if (!isBufferDirty) return;

    try {
        const docRef = db.collection('persimpangan').doc('simpang-utama');

        // Bangun update object dengan dot notation
        // FIX: serverTimestamp() ditambahkan di sini (saat write), bukan saat buffer
        const updateData = {};

        for (const [jalur, data] of Object.entries(bufferJalur)) {
            updateData[`jalur.${jalur}`] = {
                ...data,
                last_update: admin.firestore.FieldValue.serverTimestamp()
            };
        }

        for (const [jalur, data] of Object.entries(bufferSisa)) {
            updateData[`sisa_antrian.${jalur}`] = {
                ...data,
                waktu: admin.firestore.FieldValue.serverTimestamp()
            };
        }

        // Update dengan merge agar jalur lain tidak tertimpa
        await docRef.set(updateData, { merge: true });

        isBufferDirty = false;
        console.log(`☁️  [FIREBASE] Batch write berhasil | jalur: ${Object.keys(bufferJalur).join(', ')}`);

        // Reset buffer setelah berhasil dikirim
        bufferJalur = {};
        bufferSisa = {};

    } catch (err) {
        console.error('❌ Gagal batch write Firebase:', err.message);
    }
}, 3000);

// ─────────────────────────────────────────────────────
// KONEKSI MQTT
// ─────────────────────────────────────────────────────
const client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', () => {
    console.log('✅ Bridge Terhubung ke Mosquitto');
    client.subscribe('smartraf/sensor', (err) => {
        if (!err) console.log('📡 Subscribe: smartraf/sensor');
        else console.error('❌ Subscribe gagal:', err.message);
    });

    if (!isFirestoreListening) {
        startFirestoreListener();
        isFirestoreListening = true;
    }
});

client.on('error', (err) => console.error('❌ MQTT Error:', err.message));
client.on('disconnect', () => console.warn('⚠️  MQTT Terputus'));
client.on('reconnect', () => console.log('🔄 MQTT Reconnect...'));

// ─────────────────────────────────────────────────────
// FIRESTORE LISTENER — sinkronisasi mode darurat dari web
// ─────────────────────────────────────────────────────
function startFirestoreListener() {
    db.collection('persimpangan').doc('simpang-utama').onSnapshot((doc) => {
        if (!doc.exists) return;
        const data = doc.data();
        const statusBaru = data.status_darurat || 'OFF';

        // Darurat dimatikan dari web
        if (statusBaru === 'OFF' && configSimpang.status_darurat !== 'OFF') {
            daruratSudahDikirim = false;
            console.log('🔄 Mode Normal Kembali Aktif');
            if (client.connected) {
                client.publish('smartraf/kontrol', JSON.stringify({ perintah: 'DARURAT_OFF' }));
            }
        }

        configSimpang.status_darurat = statusBaru;
        if (data.pengaturan_manual) configSimpang.pengaturan_manual = data.pengaturan_manual;

        // Darurat baru aktif
        if (statusBaru !== 'OFF' && !daruratSudahDikirim && client.connected) {
            client.publish('smartraf/kontrol', JSON.stringify({
                perintah: 'FORCE_HIJAU',
                jalur: statusBaru
            }));
            daruratSudahDikirim = true;
            console.log(`🚑 Emergency: ${statusBaru.toUpperCase()} dipaksa HIJAU`);
        }
    }, (err) => {
        console.error('❌ Firestore onSnapshot error:', err.message);
    });

    console.log('🔥 Firestore listener aktif');
}

// ─────────────────────────────────────────────────────
// PROSES PESAN MQTT
// ─────────────────────────────────────────────────────
client.on('message', async (topic, message) => {
    if (topic !== 'smartraf/sensor') return;

    let payload;
    try {
        payload = JSON.parse(message.toString());
    } catch (e) {
        console.error('❌ JSON tidak valid:', message.toString());
        return;
    }

    const jalur = payload.jalur_arah;
    const tipe = payload.tipe || 'sensor';

    // Validasi jalur
    if (!['barat', 'timur', 'selatan'].includes(jalur)) {
        console.error(`❌ jalur_arah tidak valid: "${jalur}"`);
        return;
    }

    if (tipe === 'sisa_antrian') {
        handleSisaAntrian(jalur, payload);
    } else {
        handleSensor(jalur, payload);
    }
});

// ─────────────────────────────────────────────────────
// HANDLER: DATA SENSOR REAL-TIME
//
// Payload dari Master (v3.5):
// {
//   pers_id, jalur_arah, tipe: "sensor",
//   jarak_cm, jumlah_masuk, sudah_lewat, sisa_antrian,
//   status_kepadatan, status_lampu,
//   sisa_waktu_detik, durasi_total_detik, jalur_aktif, fase
// }
// ─────────────────────────────────────────────────────
async function handleSensor(jalur, payload) {
    // ── Dirty check (hemat kuota) ────────────────────
    const cache = lastWrittenData[jalur] || {};
    const jarakDiff = Math.abs((cache.jarak_cm || 0) - (payload.jarak_cm || 0));
    const timeDiff = Date.now() - (cache.timestamp || 0);

    const adaPerubahan =
        payload.status_lampu !== cache.status_lampu ||
        payload.status_kepadatan !== cache.status_kepadatan ||
        payload.sisa_antrian !== cache.sisa_antrian ||
        payload.jumlah_masuk !== cache.jumlah_masuk ||
        jarakDiff > 10 ||   // jarak berubah >10cm
        timeDiff >= 15000;    // refresh minimal 15 detik

    if (adaPerubahan) {
        // Masukkan ke buffer (tanpa serverTimestamp — ditambah saat write)
        bufferJalur[jalur] = {
            jarak_cm: payload.jarak_cm,
            jumlah_masuk: payload.jumlah_masuk ?? 0,
            sudah_lewat: payload.sudah_lewat ?? 0,
            sisa_antrian: payload.sisa_antrian ?? 0,
            status_kepadatan: payload.status_kepadatan,
            status_lampu: payload.status_lampu,
            sisa_waktu_detik: payload.sisa_waktu_detik ?? 0,
            fase: payload.fase ?? 'MERAH',
            jalur_aktif: payload.jalur_aktif ?? '-'
        };
        isBufferDirty = true;

        // Update cache
        lastWrittenData[jalur] = {
            jarak_cm: payload.jarak_cm,
            status_lampu: payload.status_lampu,
            status_kepadatan: payload.status_kepadatan,
            sisa_antrian: payload.sisa_antrian ?? 0,
            jumlah_masuk: payload.jumlah_masuk ?? 0,
            timestamp: Date.now()
        };
    }

    // ── Log histori (throttle 1 menit per jalur) ─────
    const now = Date.now();
    if (!lastLogTime[jalur] || now - lastLogTime[jalur] >= 60000) {
        try {
            await db.collection('kepadatan_jalan').add({
                jalur_arah: jalur,
                jarak_cm: payload.jarak_cm,
                jumlah_masuk: payload.jumlah_masuk ?? 0,
                sudah_lewat: payload.sudah_lewat ?? 0,
                sisa_antrian: payload.sisa_antrian ?? 0,
                status_kepadatan: payload.status_kepadatan,
                status_lampu: payload.status_lampu,
                fase: payload.fase ?? 'MERAH',
                timestamp_ms: now,
                waktu: admin.firestore.FieldValue.serverTimestamp()
            });
            lastLogTime[jalur] = now;
            console.log(`📝 Log histori ${jalur} disimpan`);
        } catch (err) {
            console.error(`❌ Gagal simpan histori ${jalur}:`, err.message);
        }
    }

    // ── Log real-time terminal ────────────────────────
    console.log(
        `🚦 [${jalur.padEnd(7)}] ${(payload.status_lampu || '?').padEnd(6)} | ` +
        `sisa ${String(payload.sisa_waktu_detik ?? 0).padStart(3)}s | ` +
        `masuk=${payload.jumlah_masuk ?? 0} lewat=${payload.sudah_lewat ?? 0} ` +
        `sisa=${payload.sisa_antrian ?? 0} | ` +
        `${(payload.status_kepadatan || '?').padEnd(6)} | ${payload.jarak_cm}cm`
    );
}

// ─────────────────────────────────────────────────────
// HANDLER: SISA ANTRIAN PASCA HIJAU
//
// Payload dari Master:
// {
//   pers_id, jalur_arah, tipe: "sisa_antrian",
//   sisa_antrian: { status, sisa_kendaraan, jarak_cm, bonus_detik }
// }
// ─────────────────────────────────────────────────────
function handleSisaAntrian(jalur, payload) {
    const sisa = payload.sisa_antrian;
    if (!sisa) {
        console.error('❌ Field sisa_antrian tidak ada di payload');
        return;
    }

    // Masukkan ke buffer sisa (ditulis saat batch write)
    bufferSisa[jalur] = {
        status: sisa.status,
        sisa_kendaraan: sisa.sisa_kendaraan,
        jarak_cm: sisa.jarak_cm,
        bonus_detik: sisa.bonus_detik
    };
    isBufferDirty = true;

    // Log ke histori sisa antrian (langsung, tidak dibuffer karena jarang terjadi)
    db.collection('sisa_antrian_log').add({
        jalur_arah: jalur,
        status: sisa.status,
        sisa_kendaraan: sisa.sisa_kendaraan,
        jarak_cm: sisa.jarak_cm,
        bonus_detik: sisa.bonus_detik,
        timestamp_ms: Date.now(),
        waktu: admin.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.error('❌ Gagal simpan sisa_antrian_log:', err.message));

    const icon = sisa.status === 'MACET' ? '🔴' : sisa.status === 'PADAT' ? '🟡' : '🟢';
    console.log(
        `${icon} SISA [${jalur.padEnd(7)}] ` +
        `${sisa.status.padEnd(6)} | ` +
        `${sisa.sisa_kendaraan} kend | ` +
        `${sisa.jarak_cm}cm | ` +
        `bonus +${sisa.bonus_detik}dtk`
    );
}