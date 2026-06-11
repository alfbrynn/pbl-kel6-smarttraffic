import os
import sys
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import urllib.request
import urllib.error

# ==============================================================================
# CONFIGURATION & PATHS
# Resolve path relative to this script's directory for absolute reliability
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "../serviceAccountKey.json")

if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "../bridge/serviceAccountKey.json")
if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join(SCRIPT_DIR, "serviceAccountKey.json")

# Attempt to load GROQ_API_KEY from environment or .env.local
def get_groq_api_key():
    # 1. Check direct system environment
    key = os.environ.get("GROQ_API_KEY")
    if key:
        return key
    
    # 2. Check root .env.local file
    for path in ["../.env.local", "./.env.local", ".env.local"]:
        if os.path.exists(path):
            with open(path, "r") as f:
                for line in f:
                    if line.startswith("GROQ_API_KEY="):
                        return line.split("=", 1)[1].strip()
    return None

def init_firebase():
    if os.path.exists(CREDENTIALS_PATH):
        try:
            # Check if app is already initialized
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate(CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
        return firestore.client()
    else:
        print(f"⚠️ Warning: Credentials file not found at {CREDENTIALS_PATH}")
        return None

def get_ai_recommendation(summary_text, api_key):
    if not api_key:
        return "⚠️ GROQ_API_KEY tidak ditemukan. Silakan tambahkan kunci API Groq Anda ke file .env.local di server untuk mengaktifkan Rekomendasi AI otomatis."

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    prompt = (
        "Analisis data statistik lalu lintas hasil pengolahan Apache Spark berikut ini:\n\n"
        f"{summary_text}\n\n"
        "Berikan rekomendasi taktis dengan ketentuan berikut:\n"
        "1. Sebutkan jalur spesifik (Barat, Timur, atau Selatan) beserta angka rata-rata volume kendaraannya.\n"
        "2. Berikan usulan nilai numerik konkret untuk durasi lampu (misalnya: 'naikkan max_hijau Jalur Selatan menjadi 70 detik' atau 'turunkan min_hijau Jalur Barat menjadi 10 detik' untuk efisiensi).\n"
        "3. Tulis maksimal dalam 3 kalimat ringkas yang langsung fokus pada aksi/tindakan konfigurasi."
    )

    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "Anda adalah Traffic Engineer AI untuk sistem SMARTRAF. Tugas Anda memberikan rekomendasi pengaturan waktu lampu lalu lintas (min_hijau_detik dan max_hijau_detik) secara konkret, spesifik berbasis data, tanpa basa-basi."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 200
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"].strip()
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        try:
            error_json = json.loads(error_msg)
            return f"❌ Gagal memanggil Groq API (HTTP {e.code}): {error_json.get('error', {}).get('message', error_msg)}"
        except:
            return f"❌ Gagal memanggil Groq API (HTTP {e.code}): {error_msg}"
    except Exception as e:
        return f"❌ Terjadi kesalahan saat menghubungi AI: {str(e)}"

def main():
    db = init_firebase()
    if db is None:
        print("❌ Firebase gagal diinisialisasi.")
        sys.exit(1)

    doc_ref = db.collection("system").document("bigdata")
    api_key = get_groq_api_key()

    try:
        # Import PySpark inside main to ensure Spark packages are initialized
        from pyspark.sql import SparkSession
        from pyspark.sql.functions import col, avg

        print("⚡ Menginisialisasi Spark Session...")
        spark = SparkSession.builder \
            .appName("SmartTrafficAnalysis") \
            .master("local[*]") \
            .getOrCreate()

        # Membaca seluruh file batch CSV dari HDFS
        hdfs_path = "hdfs://localhost:9000/smartraf/logs/traffic_batch_*.csv"
        print(f"📖 Membaca data HDFS: {hdfs_path}...")
        df = spark.read.csv(hdfs_path, header=True, inferSchema=True)
        
        total_records = df.count()
        print(f"📊 Menemukan {total_records} data log.")

        if total_records == 0:
            results = {
                "total_records": 0,
                "avg_vehicles": {},
                "avg_queue_cm": {},
                "peak_lane": "N/A",
                "congestion_stats": {},
                "last_run": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "ai_recommendation": "Tidak ada data lalu lintas untuk dianalisis di HDFS."
            }
            doc_ref.set({
                "status": "completed",
                "finished_at": firestore.SERVER_TIMESTAMP,
                "results": results,
                "error": None
            }, merge=True)
            spark.stop()
            print("✨ Analisis selesai (data kosong).")
            return

        # 1. Rata-rata kendaraan per jalur
        print("🧮 Menghitung rata-rata kendaraan per jalur...")
        avg_vehicles_df = df.groupBy("jalur").agg(avg("jumlah_kendaraan").alias("avg_vehicles")).collect()
        avg_vehicles = {row["jalur"]: round(row["avg_vehicles"], 2) for row in avg_vehicles_df if row["jalur"]}

        # 2. Rata-rata jarak (antrean) per jalur
        print("🧮 Menghitung rata-rata antrean (jarak cm) per jalur...")
        avg_queue_df = df.groupBy("jalur").agg(avg("jarak_cm").alias("avg_queue")).collect()
        avg_queue = {row["jalur"]: round(row["avg_queue"], 2) for row in avg_queue_df if row["jalur"]}

        # 3. Jalur dengan rata-rata kendaraan tertinggi
        peak_lane = "N/A"
        if avg_vehicles:
            peak_lane = max(avg_vehicles, key=avg_vehicles.get)

        # 4. Distribusi status kepadatan
        print("🧮 Menganalisis kondisi kepadatan...")
        congestion_df = df.groupBy("jalur", "status_kepadatan").count().collect()
        congestion_stats = {}
        for row in congestion_df:
            lane = row["jalur"]
            status = row["status_kepadatan"]
            count = row["count"]
            if lane and status:
                if lane not in congestion_stats:
                    congestion_stats[lane] = {}
                congestion_stats[lane][status] = count

        # Buat rangkuman teks untuk dikirim ke Groq API
        summary_text = (
            f"- Total log di HDFS: {total_records} baris.\n"
            f"- Rata-rata jumlah kendaraan per jalur: {json.dumps(avg_vehicles)}\n"
            f"- Rata-rata jarak sensor (antrean cm): {json.dumps(avg_queue)} (Jarak lebih kecil = antrean lebih panjang)\n"
            f"- Jalur dengan beban kendaraan tertinggi: Jalur {peak_lane.upper()}\n"
            f"- Distribusi kepadatan per jalur: {json.dumps(congestion_stats)}"
        )

        print("🤖 Menghubungi Groq AI untuk mendapatkan analisis rekomendasi...")
        ai_rec = get_ai_recommendation(summary_text, api_key)
        print(f"📝 Rekomendasi AI: {ai_rec}")

        results = {
            "total_records": total_records,
            "avg_vehicles": avg_vehicles,
            "avg_queue_cm": avg_queue,
            "peak_lane": peak_lane,
            "congestion_stats": congestion_stats,
            "last_run": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "ai_recommendation": ai_rec
        }

        # Update Firestore
        doc_ref.set({
            "status": "completed",
            "finished_at": firestore.SERVER_TIMESTAMP,
            "results": results,
            "error": None
        }, merge=True)

        spark.stop()
        print("✅ Analisis Big Data HDFS & Spark Sukses diselesaikan!")

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Terjadi kesalahan saat analisis: {error_msg}")
        doc_ref.set({
            "status": "failed",
            "error": error_msg,
            "finished_at": firestore.SERVER_TIMESTAMP
        }, merge=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
