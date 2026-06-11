# Ingest Data to Hadoop HDFS (Big Data Component)

Direktori ini berisi script Python untuk mengintegrasikan database Firestore dengan penyimpanan Hadoop Distributed File System (HDFS) pada VM GCP.

---

## 📋 Prasyarat di VM GCP
1. VM GCP minimal menggunakan spesifikasi **`e2-medium` (4 GB RAM)** agar Hadoop berjalan stabil.
2. Java 17 (`default-jdk`) terinstall di VM.
3. Hadoop 3.3.6 terinstall di `/usr/local/hadoop`.
4. Library python `firebase-admin` terinstall di VM (`pip3 install firebase-admin --break-system-packages`).
5. Folder tujuan di HDFS sudah dibuat:
   ```bash
   hdfs dfs -mkdir -p /smartraf/logs
   ```

---

## 🚀 Manajemen Servis Hadoop (Saat VM Dinyalakan/Dimatikan)
Hadoop tidak berjalan otomatis ketika VM GCP Anda dinyalakan ulang. Gunakan perintah berikut untuk mengaturnya:

### 1. Menjalankan Hadoop (Setelah VM Dinyalakan)
Jalankan perintah ini di SSH VM untuk memulai NameNode dan DataNode:
```bash
start-dfs.sh
```
*Gunakan perintah `jps` untuk memastikan proses **NameNode** dan **DataNode** sudah aktif.*

### 2. Mematikan Hadoop (Sebelum VM Dimatikan/Stop)
Sangat disarankan untuk mematikan servis Hadoop secara bersih sebelum mematikan instance VM GCP di Console untuk menghindari kerusakan data (corrupt):
```bash
stop-dfs.sh
```

---

## 🖥️ Mengakses Web UI Hadoop (Port 9870)
Karena browser menolak koneksi HTTP langsung ke IP Publik, gunakan **SSH Port Forwarding** untuk membukanya secara aman di laptop lokal Anda:

1. Buka CMD / PowerShell baru di laptop lokal Anda.
2. Jalankan perintah SSH berikut:
   ```bash
   ssh -L 9870:localhost:9870 aliffebriansyah1074@34.128.88.238
   ```
3. Biarkan terminal tersebut tetap terbuka.
4. Buka browser di laptop Anda, lalu akses:
   👉 **[http://localhost:9870](http://localhost:9870)**
5. Untuk melihat file CSV yang tersimpan, masuk ke menu **Utilities** -> **Browse the file system** di halaman dashboard tersebut.

---

## 📥 Cara Menggunakan Script Ingest

1. Masuk ke direktori `bigdata` di VM Anda:
   ```bash
   cd ~/smartraf-bridge/bigdata  # Sesuaikan dengan path repositori Anda
   ```

2. Jalankan perintah script:
   ```bash
   python3 ingest.py
   ```

Script akan otomatis:
- Menarik log data baru dari Firestore (`kepadatan_jalan`) berdasarkan timestamp ingest terakhir.
- Mengonversi data tersebut ke format CSV.
- Mengunggah file CSV tersebut ke direktori HDFS `/smartraf/logs/` dengan nama file unik.
- Menyimpan timestamp pemrosesan terakhir ke `/tmp/last_ingest_time.txt`.

---

## 📊 Analisis Data (Big Data Component)

Setelah data log berhasil dikumpulkan di Hadoop HDFS, Anda dapat melakukan analisis data menggunakan salah satu opsi berikut:

### Opsi A: Menggunakan PySpark (Rekomendasi ⚡)

PySpark sangat efisien untuk memproses data berukuran besar langsung di memori.

1. **Install PySpark di VM GCP:**
   ```bash
   pip3 install pyspark --break-system-packages
   ```

2. **Jalankan script PySpark:**
   Anda bisa membuat script Python (misal `analyze.py`) dengan konten berikut:
   ```python
   from pyspark.sql import SparkSession
   from pyspark.sql.functions import col, avg, desc

   # Inisialisasi Spark Session
   spark = SparkSession.builder \
       .appName("SmartTrafficAnalysis") \
       .master("local[*]") \
       .getOrCreate()

   # Membaca seluruh file batch CSV dari HDFS
   hdfs_path = "hdfs://localhost:9000/smartraf/logs/traffic_batch_*.csv"
   df = spark.read.csv(hdfs_path, header=True, inferSchema=True)

   print("📋 Skema Data:")
   df.printSchema()

   print("\n📊 Rata-rata Jumlah Kendaraan per Jalur:")
   df.groupBy("jalur") \
     .agg(avg("jumlah_kendaraan").alias("avg_kendaraan")) \
     .orderBy(desc("avg_kendaraan")) \
     .show()

   spark.stop()
   ```

3. **Eksekusi analisis:**
   ```bash
   python3 analyze.py
   ```

### Opsi B: Menggunakan Hadoop MapReduce Streaming (Tradisional ⚙️)

Jika Anda diwajibkan menggunakan paradigma MapReduce murni, gunakan modul **Hadoop Streaming** dengan Python.

1. **Buat file `mapper.py`:**
   ```python
   #!/usr/bin/env python3
   import sys

   for line in sys.stdin:
       line = line.strip()
       parts = line.split(',')
       if len(parts) < 6 or parts[0] == "waktu":  # Lewati header
           continue
       jalur = parts[1]
       try:
           jumlah_kendaraan = int(parts[3])
           print(f"{jalur}\t{jumlah_kendaraan}")
       except ValueError:
           continue
   ```

2. **Buat file `reducer.py`:**
   ```python
   #!/usr/bin/env python3
   import sys

   current_jalur = None
   total_kendaraan = 0
   count = 0

   for line in sys.stdin:
       line = line.strip()
       jalur, jumlah = line.split('\t', 1)
       try:
           jumlah = int(jumlah)
       except ValueError:
           continue

       if current_jalur == jalur:
           total_kendaraan += jumlah
           count += 1
       else:
           if current_jalur:
               print(f"{current_jalur}\tRata-rata: {total_kendaraan / count:.2f}")
           current_jalur = jalur
           total_kendaraan = jumlah
           count = 1

   if current_jalur == jalur:
       print(f"{current_jalur}\tRata-rata: {total_kendaraan / count:.2f}")
   ```

3. **Beri izin eksekusi pada script:**
   ```bash
   chmod +x mapper.py reducer.py
   ```

4. **Jalankan MapReduce Job di Hadoop:**
   ```bash
   mapred streaming \
     -files mapper.py,reducer.py \
     -mapper ./mapper.py \
     -reducer ./reducer.py \
     -input /smartraf/logs/*.csv \
     -output /smartraf/output_analysis
   ```

5. **Lihat Hasil Analisis MapReduce:**
   ```bash
   hdfs dfs -cat /smartraf/output_analysis/part-00000
   ```

---

## 🛠️ Perintah Bermanfaat (Hadoop CLI)

*   **Mengecek list file di HDFS:**
    ```bash
    hdfs dfs -ls /smartraf/logs
    ```
*   **Membaca isi file CSV di HDFS:**
    ```bash
    hdfs dfs -cat /smartraf/logs/nama_file_batch.csv
    ```
*   **Menghapus seluruh data dummy/logs di HDFS:**
    ```bash
    hdfs dfs -rm -r /smartraf/logs/*
    ```
*   **Mereset status penarikan data Python (Ingest dari awal):**
    ```bash
    rm /tmp/last_ingest_time.txt
    ```
