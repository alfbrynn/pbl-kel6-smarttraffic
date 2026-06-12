import os
import csv
import time
import subprocess
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# ==============================================================================
# CONFIGURATION
# ==============================================================================
# Resolve path relative to this script's directory for absolute reliability
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "../serviceAccountKey.json")

if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "../bridge/serviceAccountKey.json")
if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "serviceAccountKey.json")

HDFS_TARGET_DIR = "/smartraf/logs"
LOCAL_CSV_PATH = "/tmp/data_traffic_temp.csv"
STATE_FILE = "/tmp/last_ingest_time.txt"

if os.path.exists(CREDENTIALS_PATH):
    cred = credentials.Certificate(CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    db = None
    print(f"⚠️ Warning: File credential Firebase tidak ditemukan di: {CREDENTIALS_PATH}")
    print("Pastikan file serviceAccountKey.json diletakkan di lokasi yang benar di VM.")

def get_last_processed_timestamp():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            try:
                return int(f.read().strip())
            except ValueError:
                return 0
    return 0

def update_last_processed_timestamp(ts):
    with open(STATE_FILE, "w") as f:
        f.write(str(ts))

def main():
    if db is None:
        print("❌ Inisialisasi Firebase gagal karena file kredensial tidak ditemukan.")
        return

    last_ts = get_last_processed_timestamp()
    print(f"🔄 Menarik log baru dari Firestore (timestamp > {last_ts})...")

    # Ambil data log 'kepadatan_jalan' yang lebih baru dari pemrosesan terakhir
    logs_ref = db.collection("kepadatan_jalan")
    query = logs_ref.where("timestamp_ms", ">", last_ts).order_by("timestamp_ms")
    docs = list(query.stream())

    if not docs:
        print("✨ Tidak ada data log baru sejak penarikan terakhir.")
        return

    data_to_write = []
    max_ts = last_ts

    for doc in docs:
        d = doc.to_dict()
        timestamp = d.get("timestamp_ms", 0)
        
        # Format milidetik ke representasi waktu lokal dibaca manusia
        dt_str = datetime.fromtimestamp(timestamp / 1000.0).strftime('%Y-%m-%d %H:%M:%S')
        
        data_row = [
            dt_str,
            d.get("jalur_arah", ""),
            d.get("jarak_cm", 0.0),
            d.get("sisa_antrian") if d.get("sisa_antrian") is not None else d.get("jumlah_kendaraan", 0),
            d.get("status_lampu", ""),
            d.get("status_kepadatan", "")
        ]
        data_to_write.append(data_row)
        if timestamp > max_ts:
            max_ts = timestamp

    # Tulis data ke file CSV lokal sementara
    print(f"📝 Menulis {len(data_to_write)} log ke file lokal CSV...")
    with open(LOCAL_CSV_PATH, "w", newline="") as f:
        writer = csv.writer(f)
        # Menulis header kolom
        writer.writerow(["waktu", "jalur", "jarak_cm", "jumlah_kendaraan", "status_lampu", "status_kepadatan"])
        writer.writerows(data_to_write)

    # Menentukan nama file batch unik di HDFS berdasarkan timestamp detik saat ini
    filename = f"traffic_batch_{int(time.time())}.csv"
    hdfs_dest_path = f"{HDFS_TARGET_DIR}/{filename}"
    print(f"☁️ Mengunggah file ke HDFS: {hdfs_dest_path}...")
    
    # Menjalankan perintah CLI HDFS untuk menaruh file
    cmd = ["hdfs", "dfs", "-put", LOCAL_CSV_PATH, hdfs_dest_path]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode == 0:
        print("✅ UPLOAD KE HADOOP HDFS BERHASIL!")
        update_last_processed_timestamp(max_ts)
        # Bersihkan file sampah lokal
        if os.path.exists(LOCAL_CSV_PATH):
            os.remove(LOCAL_CSV_PATH)
    else:
        print("❌ GAGAL MENGUNGGAH KE HDFS:")
        print(result.stderr.decode())

if __name__ == "__main__":
    main()
