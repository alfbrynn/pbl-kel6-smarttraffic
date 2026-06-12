import os
import sys
import subprocess
import firebase_admin
from firebase_admin import credentials, firestore

# ==============================================================================
# 1. KONFIGURASI JALUR
# ==============================================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "serviceAccountKey.json")

# Cari path kredensial Firebase
if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "bridge/serviceAccountKey.json")
if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "bigdata/serviceAccountKey.json")

# File state lokal dari ingest.py
STATE_FILE = "/tmp/last_ingest_time.txt"

# ==============================================================================
# 2. INISIALISASI FIREBASE
# ==============================================================================
if not os.path.exists(CREDENTIALS_PATH):
    print(f"❌ File credential Firebase tidak ditemukan!")
    print(f"Dicari di: {CREDENTIALS_PATH}")
    print("Pastikan file serviceAccountKey.json berada di folder proyek utama.")
    sys.exit(1)

print(f"🔑 Menggunakan file credential: {CREDENTIALS_PATH}")
cred = credentials.Certificate(CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()

# ==============================================================================
# 3. FUNGSI PEMBERSIH KOLEKSI FIRESTORE (BATCH DELETION)
# ==============================================================================
def delete_collection(collection_name, batch_size=100):
    col_ref = db.collection(collection_name)
    docs = col_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return deleted + delete_collection(collection_name, batch_size)
    return deleted

# ==============================================================================
# 4. MULAI PROSES PEMBERSIHAN
# ==============================================================================
print("\n--- 🧹 MEMULAI PROSES RESET DATA DEMO SMARTRAF ---")

# A. Bersihkan Koleksi Log & Audit di Firestore
try:
    print("⏳ Menghapus riwayat log kepadatan_jalan di Firestore...")
    deleted_logs = delete_collection("kepadatan_jalan")
    print(f"✅ Berhasil menghapus {deleted_logs} dokumen log kepadatan_jalan.")
except Exception as e:
    print(f"⚠️ Gagal menghapus koleksi kepadatan_jalan: {e}")

try:
    print("⏳ Menghapus log audit aktivitas operator di Firestore...")
    deleted_audits = delete_collection("audit_logs")
    print(f"✅ Berhasil menghapus {deleted_audits} dokumen audit_logs.")
except Exception as e:
    print(f"⚠️ Gagal menghapus koleksi audit_logs: {e}")

# B. Reset Dokumen System Big Data
try:
    print("⏳ Mereset status Big Data di Firestore ke kondisi IDLE...")
    doc_ref = db.collection("system").document("bigdata")
    doc_ref.set({
        "status": "idle",
        "error": None,
        "results": None,
        "triggered_at": None,
        "finished_at": None
    })
    print("✅ Status Big Data berhasil di-reset ke IDLE.")
except Exception as e:
    print(f"⚠️ Gagal mereset status system/bigdata: {e}")

# C. Reset State File Lokal Ingest
try:
    print(f"⏳ Mereset index waktu penarikan lokal di {STATE_FILE}...")
    with open(STATE_FILE, "w") as f:
        f.write("0")
    print("✅ Index waktu penarikan berhasil di-reset ke 0.")
except Exception as e:
    # Coba juga path alternatif di Windows jika menggunakan temporary directory lokal
    alt_state = os.path.join(SCRIPT_DIR, "bigdata/last_ingest_time.txt")
    try:
        with open(alt_state, "w") as f:
            f.write("0")
        print(f"✅ Index waktu penarikan alternatif di-reset ke 0.")
    except:
        print(f"⚠️ Gagal mereset file state: {e}")

# D. Hapus File CSV di Hadoop HDFS
print("⏳ Menghapus batch file CSV di Hadoop HDFS...")
hdfs_cmd = "hdfs dfs -rm -f /smartraf/logs/traffic_batch_*.csv"
try:
    result = subprocess.run(hdfs_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode == 0:
        print("✅ Berhasil menghapus seluruh data traffic_batch_*.csv di HDFS.")
    else:
        print(f"⚠️ Peringatan HDFS: {result.stderr.strip()}")
        print("   (Ini wajar jika HDFS kosong atau perintah dijalankan di luar kluster Hadoop VM)")
except Exception as e:
    print(f"⚠️ Gagal mengeksekusi perintah HDFS dfs -rm: {e}")

print("\n🎉 RESET DATA SMARTRAF SELESAI!")
print("Sistem sekarang berada dalam keadaan bersih (Clean State) untuk demo presentasi.")
