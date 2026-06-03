// smartraf-bridge v2.4 (Final Fix - IoT Synchronized)
// VM: vm-kelompok-6-2026 | Location: Jakarta
const mqtt = require('mqtt');
const admin = require('firebase-admin');

// 1. INISIALISASI
admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
});
const db = admin.firestore();

// 2. STATE & CACHE
let configSimpang = {
    status_darurat: 'OFF',
    pengaturan_manual: { jarak_padat_cm: 30, min_hijau_detik: 15, max_hijau_detik: 60 }
};

let daruratSudahDikirim = false;
let isFirestoreListening = false;
const lastLogTime = {};
const lastSentDuration = {};
const lastWrittenData = {};

// 3. KONEKSI MQTT
const client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', () => {
    console.log('✅ Bridge Terhubung ke Mosquitto');
    client.subscribe('smartraf/sensor');

    // Sinkronisasi Config & Mode Darurat dari Web
    if (!isFirestoreListening) {
        db.collection('persimpangan').doc('simpang-utama').onSnapshot((doc) => {
            if (!doc.exists) return;
            const data = doc.data();
            const statusBaru = data.status_darurat || 'OFF';

            if (statusBaru === 'OFF' && configSimpang.status_darurat !== 'OFF') {
                daruratSudahDikirim = false;
                console.log('🔄 Mode Normal Kembali Aktif');
                // Memberitahu ESP32 untuk menghapus mode darurat
                client.publish('smartraf/kontrol', JSON.stringify({ perintah: 'DARURAT_OFF' }));
            }

            configSimpang.status_darurat = statusBaru;
            if (data.pengaturan_manual) configSimpang.pengaturan_manual = data.pengaturan_manual;

            if (statusBaru !== 'OFF' && !daruratSudahDikirim && client.connected) {
                client.publish('smartraf/kontrol', JSON.stringify({ perintah: 'FORCE_HIJAU', jalur: statusBaru }));
                daruratSudahDikirim = true;
                console.log(`🚑 Emergency: ${statusBaru.toUpperCase()} dipaksa HIJAU`);
            }
        });
        isFirestoreListening = true;
    }
});

// 4. SISTEM BUFFER UNTUK MENCEGAH LIMIT FIRESTORE
let bufferDataPersimpangan = { jalur: {} };
let isBufferDirty = false;

// Worker yang mengirim data ke Firestore setiap 3 detik
setInterval(async () => {
    if (isBufferDirty) {
        try {
            const docRef = db.collection('persimpangan').doc('simpang-utama');
            // Menulis 3 jalur sekaligus dalam 1 kali request
            await docRef.set(bufferDataPersimpangan, { merge: true });
            isBufferDirty = false; // Reset status
            console.log('☁️ [FIREBASE] Sinkronisasi Batch Berhasil (Hemat Kuota)');
        } catch (err) {
            console.error('❌ Gagal sinkronisasi Firebase:', err.message);
        }
    }
}, 3000); // 3000ms = 3 detik (Aman untuk Free Tier)

// 5. PROSES DATA SENSOR (Hanya update memori lokal)
client.on('message', async (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());

        // Filter data sisa antrean
        if (payload.tipe === 'sisa_antrian') return;

        const jalur = payload.jalur_arah;

        // Caching & Dirty checking untuk menghemat kuota Firestore
        const cache = lastWrittenData[jalur] || {};
        const jarakDiff = Math.abs((cache.jarak_cm || 0) - payload.jarak_cm);
        const timeDiff = Date.now() - (cache.timestamp || 0);

        const hasSignificantChange = 
            payload.status_lampu !== cache.status_lampu ||
            payload.status_kepadatan !== cache.status_kepadatan ||
            payload.jumlah_kendaraan !== cache.jumlah_kendaraan ||
            jarakDiff > 10 || // Jarak berubah signifikan (>10cm)
            timeDiff >= 15000; // Refresh minimal setiap 15 detik

        if (hasSignificantChange) {
            // MASUKKAN KE DALAM BUFFER LOKAL (Tidak menghabiskan kuota Firestore secara langsung)
            bufferDataPersimpangan.jalur[jalur] = {
                jarak_cm: payload.jarak_cm,
                jumlah_kendaraan: payload.jumlah_kendaraan,
                status_kepadatan: payload.status_kepadatan,
                status_lampu: payload.status_lampu,
                sisa_waktu_detik: payload.sisa_waktu_detik,
                last_update: admin.firestore.FieldValue.serverTimestamp()
            };
            isBufferDirty = true; // Tandai bahwa ada data baru yang siap dikirim

            // Update cache
            lastWrittenData[jalur] = {
                jarak_cm: payload.jarak_cm,
                jumlah_kendaraan: payload.jumlah_kendaraan,
                status_kepadatan: payload.status_kepadatan,
                status_lampu: payload.status_lampu,
                timestamp: Date.now()
            };
        }

        // --- LOG HISTORI (1 Menit Sekali) ---
        const now = Date.now();
        if (!lastLogTime[jalur] || now - lastLogTime[jalur] >= 60000) {
            await db.collection('kepadatan_jalan').add({
                ...payload,
                timestamp_ms: now,
                waktu: admin.firestore.FieldValue.serverTimestamp()
            });
            lastLogTime[jalur] = now;
            console.log(`📝 Log ${jalur.toUpperCase()} Disimpan ke History.`);
        }

        // --- KONTROL ADAPTIF (MQTT) ---
        if (configSimpang.status_darurat === 'OFF' && client.connected) {
            const { min_hijau_detik, max_hijau_detik } = configSimpang.pengaturan_manual;

            const isPadat = payload.status_kepadatan === 'PADAT' || payload.status_kepadatan === 'MACET';
            let durasiFix = isPadat ? max_hijau_detik : min_hijau_detik;

            if (durasiFix !== lastSentDuration[jalur]) {
                client.publish('smartraf/kontrol', JSON.stringify({
                    perintah: 'ATUR_DURASI',
                    jalur: jalur,
                    durasi_detik: durasiFix
                }));
                lastSentDuration[jalur] = durasiFix;
            }
        }

    } catch (err) {
        console.error('❌ MQTT Parse Error:', err.message);
    }
});