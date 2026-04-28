<div align="center">

# 🚦 SMARTRAF
### Smart Adaptive Traffic System

<!-- [![GCP](https://img.shields.io/badge/Cloud-Google%20Cloud%20Platform-4285F4?style=flat-square&logo=google-cloud&logoColor=white)](https://cloud.google.com)
[![Firebase](https://img.shields.io/badge/Database-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![MQTT](https://img.shields.io/badge/Protocol-MQTT-660066?style=flat-square&logo=eclipse-mosquitto&logoColor=white)](https://mosquitto.org)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![ESP32](https://img.shields.io/badge/Hardware-ESP32-E7352C?style=flat-square&logo=espressif&logoColor=white)](https://www.espressif.com)
[![Cloud Run](https://img.shields.io/badge/Deploy-Cloud%20Run-4285F4?style=flat-square&logo=google-cloud&logoColor=white)](https://cloud.run)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE) -->

Sistem lampu lalu lintas adaptif berbasis IoT yang mengatur durasi lampu secara otomatis  
berdasarkan kepadatan kendaraan secara real-time menggunakan sensor HC-SR04 dan IR Obstacle.

**Kelompok 6 · D-IV Teknik Informatika · Politeknik Negeri Malang · 2026**

[📋 Dokumentasi Notion](https://notion.so) · [🌐 Live Dashboard](https://smartraf.web.app/) · [🐛 Report Bug](https://github.com/RizkyFebrian7/smartraf/issues)

</div>

---

## 📑 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Struktur Repository](#-struktur-repository)
- [Cara Menjalankan](#-cara-menjalankan)
  - [Prerequisites](#prerequisites)
  - [1. Setup VM & MQTT Broker](#1-setup-vm--mqtt-broker)
  - [2. Setup Bridge Script](#2-setup-bridge-script)
  - [3. Setup Web Dashboard](#3-setup-web-dashboard)
  - [4. Upload Firmware ESP32](#4-upload-firmware-esp32)
- [Environment Variables](#-environment-variables)
- [Struktur Data Firestore](#-struktur-data-firestore)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Tim Pengembang](#-tim-pengembang)

---

## 🔍 Tentang Proyek

SMARTRAF adalah sistem lampu lalu lintas cerdas berbasis IoT yang dirancang untuk mengatasi inefisiensi lampu lalu lintas konvensional yang menggunakan durasi tetap tanpa mempertimbangkan kondisi lalu lintas aktual.

### ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔴🟡🟢 **Kontrol Adaptif** | Durasi lampu hijau menyesuaikan kepadatan kendaraan secara otomatis |
| 📡 **Monitoring Real-time** | Dashboard web menampilkan status tiap jalur secara live via Firestore `onSnapshot` |
| 🚑 **Mode Darurat** | Operator dapat memprioritaskan jalur ambulans langsung dari dashboard |
| ⚙️ **Kontrol Manual** | Operator dapat mengatur threshold kepadatan dan durasi lampu via web |
| 📊 **Rekap Harian** | Data lalu lintas tersimpan di Firestore untuk analisis Big Data |
| 🔄 **Auto-recovery** | Sistem tetap berjalan secara lokal jika koneksi cloud terputus (fallback mode) |
| 🐳 **CI/CD Otomatis** | Push ke `main` → build & deploy otomatis ke Cloud Run via Cloud Build |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                        HARDWARE LAYER                   │
│                                                         │
│  [HC-SR04 Ultrasonic]  [IR Obstacle Sensor]             │
│   (Queue Tail Detection)  (Vehicle Counter)             │
│           │                      │                      │
│           └──────────┬───────────┘                      │
│                      ▼                                  │
│              [ESP32 × 4 unit]  ←──── smartraf/kontrol   |
│         (utara/selatan/timur/barat)                     │      
│                      │                                  │      
│              [Relay Module 4CH]                         │      
│         Relay1=Merah · Relay2=Kuning · Relay3=Hijau     │     
└──────────────────────│──────────────────────────────────┘
                       │ MQTT Publish                     
                       │ topic: smartraf/sensor           
                       │ interval: 5 detik                
                       ▼                                  
┌──────────────────────────────────────────────────────────┐     
│              GCP VM — vm-kelompok-6-2026                 │      
│                  Region: asia-southeast1                 │      
│                                                          │      
│  [Mosquitto MQTT Broker]  port 1883                      │      
│           │                                              │      
│  [Bridge Script — index.js]  managed by PM2              │
│           │                                              │
│           ├── add()          → kepadatan_jalan (log)     │
│           ├── set({merge})   → persimpangan (realtime)   │
│           └── onSnapshot()   ← persimpangan (config)     │
└──────────────────────│───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│           Firebase Firestore — asia-southeast1           │
│                                                          │
│  kepadatan_jalan    persimpangan    laporan_harian       │
│  (log historis)     (state RT)      (rekap harian)       │
└──────────────────────│───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│         Next.js Dashboard — Cloud Run + Firebase Hosting │
│                                                          │
│  onSnapshot() → real-time update tiap ~5 detik           │
│  Kontrol manual & mode darurat via Firestore write       │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Hardware** | ESP32, HC-SR04, IR Obstacle Sensor, Relay 4CH | Queue Tail Detection per jalur |
| **Protokol IoT** | MQTT (Mosquitto) | Port 1883, topic `smartraf/sensor` & `smartraf/kontrol` |
| **Cloud VM** | GCP Compute Engine (`vm-kelompok-6-2026`) | Jakarta region, dikelola PM2 |
| **Bridge** | Node.js + `mqtt` + `firebase-admin` | MQTT → Firestore pipeline |
| **Database** | Firebase Firestore | Region asia-southeast1 |
| **Frontend** | Next.js 14 + TypeScript | Real-time via Firebase SDK |
| **Hosting** | Google Cloud Run + Firebase Hosting | CI/CD via Cloud Build |
| **CI/CD** | Google Cloud Build + Artifact Registry | Auto-deploy on push ke `main` |

---

## 📁 Struktur Repository

```
smartraf/
├── 📁 firmware/                  # Kode ESP32 (Arduino/PlatformIO)
│   ├── src/
│   │   └── main.cpp              # Entry point firmware
│   ├── include/
│   │   └── config.h              # WiFi SSID, MQTT host, threshold
│   └── platformio.ini
│
├── 📁 bridge/                    # Bridge script (dijalankan di GCP VM)
│   ├── index.js                  # Bridge MQTT → Firestore (v2)
│   ├── ecosystem.config.js       # PM2 config
│   ├── serviceAccountKey.json    # ⚠️ JANGAN COMMIT — ada di .gitignore
│   └── package.json
│
├── 📁 web/                       # Next.js Dashboard
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Halaman dashboard utama
│   │   └── layout.tsx
│   ├── components/
│   │   ├── TrafficLight.tsx      # Komponen indikator lampu
│   │   └── SensorCard.tsx        # Card status per jalur
│   ├── lib/
│   │   └── firestore.ts          # Firestore listeners & helpers
│   ├── Dockerfile                # Multi-stage production build
│   ├── .dockerignore
│   ├── next.config.js            # output: 'standalone' — wajib!
│   └── package.json
│
├── cloudbuild.yaml               # CI/CD pipeline Cloud Build
├── .gitignore
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Google Cloud SDK](https://cloud.google.com/sdk) (`gcloud` CLI)
- [PlatformIO](https://platformio.org) (untuk firmware ESP32)
- Akun GCP dengan billing aktif
- Firebase project yang sudah dibuat

---

### 1. Setup VM & MQTT Broker

> Jalankan dari GCP Cloud Shell atau terminal dengan `gcloud` terautentikasi.

```bash
# SSH ke VM
gcloud compute ssh vm-kelompok-6-2026 --zone=asia-southeast1-b

# Install Mosquitto
sudo apt update && sudo apt install -y mosquitto mosquitto-clients

# Aktifkan & jalankan
sudo systemctl enable mosquitto
sudo systemctl start mosquitto

# Verifikasi — harusnya ada response jika sukses
mosquitto_sub -h localhost -t smartraf/sensor -v &
mosquitto_pub -h localhost -t smartraf/sensor -m '{"test": true}'
```

Pastikan **Firewall Rule GCP** sudah membuka port `1883`:

```bash
gcloud compute firewall-rules create allow-mqtt \
  --allow tcp:1883 \
  --target-tags mqtt-server \
  --description "Allow MQTT broker"
```

---

### 2. Setup Bridge Script

```bash
# Di dalam VM, clone repo dan masuk ke folder bridge
cd bridge/

# Install dependencies
npm install

# Copy dan isi environment variables
cp .env.example .env
nano .env

# Taruh serviceAccountKey.json dari Firebase Console ke folder ini
# Firebase Console → Project Settings → Service Accounts → Generate new private key

# Jalankan via PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Auto-start saat VM reboot
pm2 save && pm2 startup
```

Monitor log bridge:

```bash
pm2 logs smartraf-bridge        # real-time log
pm2 list                        # cek status semua process
pm2 restart smartraf-bridge     # restart manual
```

---

### 3. Setup Web Dashboard

```bash
cd web/

# Install dependencies
npm install

# Copy dan isi environment variables
cp .env.example .env.local
# Isi NEXT_PUBLIC_FIREBASE_* dengan config dari Firebase Console

# Jalankan development server
npm run dev
# → http://localhost:3000

# Build production (opsional, untuk test)
npm run build && npm start
```

Deploy ke Cloud Run (otomatis via CI/CD saat push ke `main`), atau manual:

```bash
# Dari root repo
gcloud builds submit --config cloudbuild.yaml
```

---

### 4. Upload Firmware ESP32

```bash
cd firmware/

# Edit konfigurasi di include/config.h
# - WIFI_SSID & WIFI_PASSWORD
# - MQTT_BROKER (IP publik vm-kelompok-6-2026)
# - JALUR_ARAH ("utara" / "selatan" / "timur" / "barat")

# Upload via PlatformIO
pio run --target upload

# Monitor serial
pio device monitor --baud 115200
```

Setiap ESP32 mewakili **1 jalur**. Pastikan `JALUR_ARAH` di `config.h` unik per unit.

---

## 🔐 Environment Variables

### Bridge (`bridge/.env`)

```env
# Firebase Service Account — jangan hardcode, gunakan file ini
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

# Firestore Project ID
FIREBASE_PROJECT_ID=your-project-id
```

### Web (`web/.env.local`)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

> ⚠️ **Jangan pernah commit file `.env`, `.env.local`, atau `serviceAccountKey.json` ke repository!**  
> Semua file tersebut sudah tercantum di `.gitignore`.

---

## 🔥 Struktur Data Firestore

### `kepadatan_jalan` — Log historis sensor

```json
{
  "pers_id": "simpang-utama",
  "jalur_arah": "utara",
  "jarak_cm": 150.5,
  "jumlah_kendaraan": 12,
  "ir_status": 0,
  "status_kepadatan": "Lancar",
  "status_lampu": "MERAH",
  "waktu": "<Firestore Timestamp>",
  "received_at": "<Firestore Timestamp>"
}
```

### `persimpangan` — State realtime (Document ID: `simpang-utama`)

```json
{
  "status_darurat": "OFF",
  "pengaturan_manual": {
    "jarak_padat_cm": 30,
    "min_hijau_detik": 15,
    "max_hijau_detik": 60
  },
  "jalur": {
    "utara": {
      "jarak_cm": 150.5,
      "jumlah_kendaraan": 12,
      "ir_status": 0,
      "status_kepadatan": "Lancar",
      "status_lampu": "MERAH",
      "last_update": "<Firestore Timestamp>"
    },
    "selatan": {},
    "timur": {},
    "barat": {}
  }
}
```

### Topic MQTT

| Topic | Arah | Payload |
|-------|------|---------|
| `smartraf/sensor` | ESP32 → Bridge | Data sensor, interval 5 detik |
| `smartraf/kontrol` | Bridge → ESP32 | Perintah durasi / FORCE_HIJAU darurat |

---

## ⚙️ CI/CD Pipeline

Pipeline berjalan otomatis setiap **push ke branch `main`** via Google Cloud Build.

```
Push ke main
    │
    ▼
Cloud Build Trigger
    │
    ├── Step 1: docker build (multi-stage)
    │          └── image: smartraf-web:{COMMIT_SHA}
    │
    ├── Step 2: docker push → Artifact Registry
    │          └── asia-southeast1-docker.pkg.dev/{PROJECT_ID}/smartraf-repo/
    │
    └── Step 3: gcloud run deploy smartraf-web
               └── --region asia-southeast1
                   --memory 512Mi
                   --min-instances 0
                   --max-instances 3
```

Setup awal Cloud Build (satu kali):

```bash
# Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# Buat Artifact Registry repo
gcloud artifacts repositories create smartraf-repo \
  --repository-format=docker \
  --location=asia-southeast1

# Beri Cloud Build permission deploy ke Cloud Run
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## 👥 Tim Pengembang

| Nama | NIM | Peran |
|------|-----|-------|
| **Adinda Mirza Devani** | 2341720046 | IoT Engineer — Firmware ESP32, sensor, relay |
| **Lutfiyyah Adzka Nur Sabrina** | 2341720148 | Big Data Engineer — ERD, pipeline data, analitik |
| **M. Alif Febriansyah** | 2341720025 | Cloud Engineer — GCP, bridge script, CI/CD |
| **Yanuar Rizky Aminudin** | 2341720030 | Web Engineer — Next.js dashboard, UI/UX |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik.
<!-- Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information. -->

---

<div align="center">

**Kelompok 6 · Politeknik Negeri Malang · 2026**

</div>