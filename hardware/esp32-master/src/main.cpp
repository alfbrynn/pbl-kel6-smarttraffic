#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// =====================================
// WIFI ACCESS POINT
// =====================================
const char* ssid     = "Polinema Hotspot 2";
const char* password = "polinemajoss";

// =====================================================
// KONFIGURASI MQTT
// =====================================================
const char* MQTT_SERVER = "34.128.88.238";
const int   MQTT_PORT   = 1883;
const char* MQTT_CLIENT_ID = "smartraf-master";
const char* TOPIC_SENSOR   = "smartraf/sensor";
const char* TOPIC_KONTROL  = "smartraf/kontrol";

// ─────────────────────────────────────────────────────
// MAPPING JALUR
// ─────────────────────────────────────────────────────
const char* namaJalur(char j) {
  if (j == 'A') return "barat";
  if (j == 'B') return "timur";
  return "selatan";
}

// =====================================================
// KONFIGURASI TCP SERVER (untuk Slave)
// =====================================================
WiFiServer tcpServer(8080);
WiFiClient slaveClient;

// =====================================
// PIN JALUR A
// =====================================
#define LEDA_MERAH   32
#define LEDA_KUNING  33
#define LEDA_HIJAU   4

#define TRIGA_PIN 25
#define ECHOA_PIN 26
#define IRA_PIN   27

// =====================================
// DURASI DASAR & BATAS (milidetik)
// =====================================
#define DURASI_DASAR     15000UL   // 15 detik (kondisi LANCAR)
#define DURASI_MIN       10000UL   // minimum 10 detik
#define DURASI_MAX       45000UL   // maksimum 45 detik
#define DURASI_KUNING     3000UL   // kuning selalu 3 detik
#define DURASI_JEDA        500UL   // jeda merah antar jalur
#define INTERVAL_MQTT      500UL   // kirim MQTT tiap 500ms

// ─────────────────────────────────────────────────────
// THRESHOLD REAL-TIME (kepadatan aktif saat lampu berjalan)
// =====================================
#define RT_PADAT_CM    50.0f
#define RT_MACET_CM   150.0f

// ─────────────────────────────────────────────────────
// THRESHOLD SISA ANTRIAN (pasca hijau selesai)
// =====================================
#define SISA_PADAT_CM    5.0f
#define SISA_MACET_CM   15.0f

// Batas jumlah kendaraan dari IR counter
#define SISA_KEND_SEDIKIT   2
#define SISA_KEND_PADAT     5

// Bonus durasi
#define BONUS_PADAT_MS    5000UL
#define BONUS_MACET_MS   10000UL

// ─────────────────────────────────────────────────────
// ENUM & STRUCT
// ─────────────────────────────────────────────────────
enum StatusSisa { SISA_LANCAR = 0, SISA_PADAT = 1, SISA_MACET = 2 };

struct BonusDurasi {
  bool adaData = false;
  unsigned long ms = 0;
  StatusSisa status = SISA_LANCAR;
  int sisaKend = 0;
  float sisaJarak = 0.0f;
};
BonusDurasi bonusA, bonusB, bonusC;

// =====================================
// STATE MACHINE
// =====================================
enum Fase { FASE_MERAH_JEDA, FASE_HIJAU, FASE_KUNING };

Fase faseSekarang = FASE_MERAH_JEDA;
char jalurAktif = 'A';
unsigned long waktuMulai = 0;
unsigned long durasiSekarang = 0;
// Urutan tetap: A(0) → B(1) → C(2) → kembali ke A
int indexJalur = 0;
const char urutanJalur[3] = {'A', 'B', 'C'};

// =====================================
// VARIABEL SENSOR A
// =====================================
int jumlahA = 0;
bool stabilA = false;
String statusA = "LANCAR";
float jarakA = 0;
unsigned long startMacetA = 0;
bool lastIRA = HIGH;

// =====================================
// DATA DARI SLAVE
// =====================================
int jumlahB = 0;
int jumlahC = 0;
bool stabilB = false;
bool stabilC = false;
String statusB = "LANCAR";
String statusC = "LANCAR";
float  jarakB  = 0.0f, jarakC = 0.0f;

// =====================================================
// STATUS LAMPU (untuk dikirim ke MQTT)
// =====================================================
String lampuA_status = "MERAH";
String lampuB_status = "MERAH";
String lampuC_status = "MERAH";

// =====================================================
// MODE DARURAT DARI VM
// =====================================================
struct OverrideDurasi {
  bool aktif = false;
  unsigned long durasi_ms = 0;
};
OverrideDurasi overrideA, overrideB, overrideC;

String modeDarurat = "OFF";  // "OFF" | "A" | "B" | "C"

// =====================================================
// MQTT & WIFI CLIENT
// =====================================================
WiFiClient wifiMqttClient;
PubSubClient mqttClient(wifiMqttClient);
unsigned long lastMqttPublish = 0;

// =====================================
// FORWARD DECLARATION
// =====================================
void lampuA(String warna);
void semuaMerah();
void kirim(String jalur, String aksi);
void bacaSlave();
void sensorA();
void printInfo();
float ultrasonikA();
unsigned long hitungDurasi(char jalur);
float bobotAntrian(int jumlah, bool stabil, String status);
void hubungWifi();
void hubungMqtt();
void mqttCallback(char* topic, byte* payload, unsigned int length);
void publishSensor(char jalur);
void rekamSisaAntrian(char jalur);
StatusSisa klasifikasiSisaJarak(float jarak);
StatusSisa klasifikasiSisaJumlah(int jumlah);
StatusSisa klasifikasiSisa(float jarak, int jumlah);
unsigned long bonusUntukStatus(StatusSisa s);
const char*namaStatusSisa(StatusSisa s);
void publishSisaAntrian(char jalur, BonusDurasi& b);
BonusDurasi& getBonusRef(char jalur);

// =====================================
// SETUP
// =====================================
void setup() {
  Serial.begin(115200);

  pinMode(LEDA_MERAH,  OUTPUT);
  pinMode(LEDA_KUNING, OUTPUT);
  pinMode(LEDA_HIJAU,  OUTPUT);
  pinMode(TRIGA_PIN,   OUTPUT);
  pinMode(ECHOA_PIN,   INPUT);
  pinMode(IRA_PIN,     INPUT);

  lampuA("MERAH");
  // Koneksi WiFi (station mode ke hotspot)
  hubungWifi();

  // MQTT
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  hubungMqtt();
  tcpServer.begin();

  Serial.println("TCP Server aktif");

  waktuMulai     = millis();
  durasiSekarang = DURASI_JEDA;
  faseSekarang   = FASE_MERAH_JEDA;

  Serial.println("====================================================");
  Serial.println("  MASTER SIAP");
  Serial.print  ("  IP WiFi  : "); Serial.println(WiFi.localIP());
  Serial.println("  Jalur : A = barat | B = timur | C = selatan");
  Serial.println("====================================================");
}

// =====================================================
// KONEKSI WIFI
// =====================================================
void hubungWifi() {
  Serial.print("[WiFi] Menghubungkan ke ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - t > 15000) {
      Serial.println("[WiFi] Timeout, retry...");
      WiFi.begin(ssid, password);
      t = millis();
    }
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] " + String(ssid) + " Terhubung: " + WiFi.localIP().toString());
}

// =====================================================
// KONEKSI MQTT
// =====================================================
void hubungMqtt() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Menghubungkan...");
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println("Terhubung!");
      mqttClient.subscribe(TOPIC_KONTROL);
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Coba lagi 3 detik...");
      delay(3000);
    }
  }
}

// =====================================================
// CALLBACK MQTT — TERIMA PERINTAH DARI VM
// =====================================================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.println("[MQTT] Perintah masuk: " + msg);

  StaticJsonDocument<256> doc;
  if (deserializeJson(doc, msg)) return;
  String perintah = doc["perintah"] | "";
  String jalur    = doc["jalur"]    | "";

  if (perintah == "FORCE_HIJAU") {
    modeDarurat = jalur; semuaMerah();
    if (jalur == "barat")   lampuA("HIJAU");
    if (jalur == "timur")   { kirim("B","HIJAU"); lampuB_status = "HIJAU"; }
    if (jalur == "selatan") { kirim("C","HIJAU"); lampuC_status = "HIJAU"; }
    faseSekarang = FASE_HIJAU; waktuMulai = millis(); durasiSekarang = 3600000UL;
    Serial.println("Mode DARURAT: " + jalur);
  }
  else if (perintah == "DARURAT_OFF") {
    if (modeDarurat != "OFF") {
      modeDarurat = "OFF"; semuaMerah();
      waktuMulai = millis(); durasiSekarang = DURASI_JEDA; faseSekarang = FASE_MERAH_JEDA;
      Serial.println("Mode Normal aktif");
    }
  }
  else if (perintah == "ATUR_DURASI") {
    int detik = doc["durasi_detik"] | 0; if (detik <= 0) return;
    unsigned long ms = constrain((unsigned long)detik * 1000UL, DURASI_MIN, DURASI_MAX);
    if (jalur == "barat")   { overrideA.aktif = true; overrideA.durasi_ms = ms; }
    if (jalur == "timur")   { overrideB.aktif = true; overrideB.durasi_ms = ms; }
    if (jalur == "selatan") { overrideC.aktif = true; overrideC.durasi_ms = ms; }
  }
  else if (perintah == "CLEAR_DURASI") {
    if (jalur == "semua") overrideA.aktif = overrideB.aktif = overrideC.aktif = false;
    else {
      if (jalur == "barat")   overrideA.aktif = false;
      if (jalur == "timur")   overrideB.aktif = false;
      if (jalur == "selatan") overrideC.aktif = false;
    }
  }
}

// =====================================================
// PUBLISH DATA SENSOR
// =====================================================
void publishSensor(char jalur) {
  StaticJsonDocument<256> doc;
  doc["pers_id"] = "simpang-utama";
  doc["jalur_arah"] = namaJalur(jalur);
  doc["tipe"] = "sensor";

  if (jalur == 'A') {
    doc["jarak_cm"]          = (int)jarakA;
    doc["jumlah_kendaraan"]  = jumlahA;
    doc["status_kepadatan"]  = statusA;
    doc["status_lampu"]      = lampuA_status;
  } else if (jalur == 'B') {
    doc["jarak_cm"]          = (int)jarakB;
    doc["jumlah_kendaraan"]  = jumlahB;
    doc["status_kepadatan"]  = statusB;
    doc["status_lampu"]      = lampuB_status;
  } else {
    doc["jarak_cm"]          = (int)jarakC;
    doc["jumlah_kendaraan"]  = jumlahC;
    doc["status_kepadatan"]  = statusC;
    doc["status_lampu"]      = lampuC_status;
  }

  unsigned long terlewat = millis() - waktuMulai;
  long sisa = (long)durasiSekarang - (long)terlewat;
  doc["sisa_waktu_detik"] = (sisa > 0) ? (int)(sisa / 1000) : 0;

  char buf[256];
  serializeJson(doc, buf);
  mqttClient.publish(TOPIC_SENSOR, buf);
}

// =====================================
// DETEKSI SISA ANTRIAN PASCA HIJAU
// =====================================
const char* namaStatusSisa(StatusSisa s) {
  if (s == SISA_MACET) return "MACET";
  if (s == SISA_PADAT) return "PADAT";
  return "LANCAR";
}

BonusDurasi& getBonusRef(char jalur) {
  if (jalur == 'A') return bonusA;
  if (jalur == 'B') return bonusB;
  return bonusC;
}

// =====================================================
// KLASIFIKASI SISA — JARAK ULTRASONIK
// =====================================================
StatusSisa klasifikasiSisaJarak(float jarak) {
  if (jarak < SISA_PADAT_CM) return SISA_LANCAR;   // < 5  cm → LANCAR
  if (jarak < SISA_MACET_CM) return SISA_PADAT;    // 5-15 cm → PADAT
  return SISA_MACET;                                 // > 15 cm → MACET
}

// =====================================================
// KLASIFIKASI SISA — JUMLAH KENDARAAN (IR counter)
// =====================================================
StatusSisa klasifikasiSisaJumlah(int jumlah) {
  if (jumlah <= SISA_KEND_SEDIKIT) return SISA_LANCAR;
  if (jumlah <= SISA_KEND_PADAT)   return SISA_PADAT;
  return SISA_MACET;
}

// =====================================================
// KLASIFIKASI SISA — GABUNGAN (ambil yang lebih buruk)
// =====================================================
StatusSisa klasifikasiSisa(float jarak, int jumlah) {
  return (StatusSisa)max(
    (int)klasifikasiSisaJarak(jarak),
    (int)klasifikasiSisaJumlah(jumlah)
  );
}

unsigned long bonusUntukStatus(StatusSisa s) {
  if (s == SISA_MACET) return BONUS_MACET_MS;
  if (s == SISA_PADAT) return BONUS_PADAT_MS;
  return 0UL;
}

// =====================================================
// PUBLISH SISA ANTRIAN KE MQTT
// =====================================================
void publishSisaAntrian(char jalur, BonusDurasi& b) {
  StaticJsonDocument<300> doc;
  doc["pers_id"]    = "simpang-utama";
  doc["jalur_arah"] = namaJalur(jalur);
  doc["tipe"]       = "sisa_antrian";

  JsonObject sisa = doc.createNestedObject("sisa_antrian");
  sisa["status"]         = namaStatusSisa(b.status);
  sisa["sisa_kendaraan"] = b.sisaKend;
  sisa["jarak_cm"]       = (int)b.sisaJarak;
  sisa["bonus_detik"]    = (int)(b.ms / 1000);

  char buf[300]; serializeJson(doc, buf);
  mqttClient.publish(TOPIC_SENSOR, buf);

  Serial.println("╔══════════════════════════════════╗");
  Serial.printf ("║  SISA ANTRIAN — %s (%s)\n", String(jalur).c_str(), namaJalur(jalur));
  Serial.println("╠══════════════════════════════════╣");
  Serial.printf ("║  Jarak terdeteksi : %.1f cm", b.sisaJarak);
  if      (b.sisaJarak < SISA_PADAT_CM) Serial.println(" → LANCAR (< 5cm, hampir kosong)");
  else if (b.sisaJarak < SISA_MACET_CM) Serial.println(" → PADAT  (5–15cm, ada sisa)");
  else                                   Serial.println(" → MACET  (> 15cm, antrian panjang)");

  Serial.printf ("║  Kendaraan tersisa: %d kend", b.sisaKend);
  if      (b.sisaKend <= SISA_KEND_SEDIKIT) Serial.println(" → LANCAR (0–2 kend)");
  else if (b.sisaKend <= SISA_KEND_PADAT)   Serial.println(" → PADAT  (3–5 kend)");
  else                                        Serial.println(" → MACET  (> 5 kend)");

  Serial.printf ("║  Status gabungan  : %s\n", namaStatusSisa(b.status));
  Serial.printf ("║  Bonus durasi     : +%d detik\n", (int)(b.ms / 1000));
  if      (b.status == SISA_LANCAR) Serial.println("║  → Antrian bersih, durasi default");
  else if (b.status == SISA_PADAT)  Serial.println("║  → Antrian padat, durasi +5 detik");
  else                               Serial.println("║  → Antrian macet, durasi +10 detik");
  Serial.println("║  (Diterapkan pada giliran hijau berikutnya)");
  Serial.println("╚══════════════════════════════════╝");
}

// =====================================================
// REKAM SISA ANTRIAN — dipanggil saat HIJAU → KUNING
// =====================================================
void rekamSisaAntrian(char jalur) {
  BonusDurasi& b = getBonusRef(jalur);

  if (jalur == 'A') {
    b.sisaJarak = ultrasonikA();   // baca langsung untuk akurasi
    b.sisaKend  = jumlahA;
  } else if (jalur == 'B') {
    b.sisaJarak = jarakB;          // data fresh dari Slave (≤500ms)
    b.sisaKend  = jumlahB;
  } else {
    b.sisaJarak = jarakC;
    b.sisaKend  = jumlahC;
  }

  b.status  = klasifikasiSisa(b.sisaJarak, b.sisaKend);
  b.ms      = bonusUntukStatus(b.status);
  b.adaData = true;

  publishSisaAntrian(jalur, b);
}

// =====================================
// ULTRASONIK A
// =====================================
float ultrasonikA() {
  digitalWrite(TRIGA_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGA_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGA_PIN, LOW);
  long durasi = pulseIn(ECHOA_PIN, HIGH, 30000);
  return durasi * 0.034f / 2.0f;
}

// =====================================
// BACA SENSOR A
// =====================================
void sensorA() {
  bool irState = digitalRead(IRA_PIN);
  if (irState == LOW && lastIRA == HIGH) {
    jumlahA++;
    Serial.println("[A] Kendaraan masuk");
  }
  lastIRA = irState;

  jarakA = ultrasonikA();

  if (jarakA < RT_PADAT_CM) {
    // Jarak pendek → tidak ada antrian berarti → LANCAR
    statusA = "LANCAR";
    stabilA = false;
    startMacetA = 0;
  }
  else if (jarakA < RT_MACET_CM) {
    // Jarak sedang → antrian mulai terbentuk → PADAT
    statusA = "PADAT";
    stabilA = false;
    startMacetA = 0;
  }
  else {
    // Jarak jauh → antrian panjang → MACET (tunggu stabil 5 detik)
    if (startMacetA == 0) startMacetA = millis();
    if (millis() - startMacetA >= 5000) { stabilA = true; statusA = "MACET"; }
    else statusA = "PADAT";   // belum stabil, anggap PADAT dulu
  }
}

// =====================================
// BACA DATA SLAVE
// FORMAT: B:jumlah:stabil:status|C:jumlah:stabil:status
// =====================================
void bacaSlave() {
  if (!slaveClient || !slaveClient.connected()) {
    WiFiClient c = tcpServer.available();
    if (c) {
      slaveClient = c;
      Serial.println("[WIFI] Slave terhubung");
    }
    return;
  }

  if (!slaveClient.available()) return;

  String data = slaveClient.readStringUntil('\n');
  data.trim();
  if (data.length() == 0) return;

  int p = data.indexOf('|');
  if (p == -1) return;

  String dataB = data.substring(0, p);
  String dataC = data.substring(p + 1);

  auto parse = [](String& d, int& jumlah, bool& stabil, String& status, float& jarak) {
    int i1 = d.indexOf(':');
    int i2 = d.indexOf(':', i1 + 1);
    int i3 = d.indexOf(':', i2 + 1);
    int i4 = d.indexOf(':', i3 + 1);
    if (i1 != -1 && i2 != -1 && i3 != -1 && i4 != -1) {
      jumlah = d.substring(i1 + 1, i2).toInt();
      stabil = d.substring(i2 + 1, i3).toInt();
      status = d.substring(i3 + 1, i4);
      jarak  = d.substring(i4 + 1).toFloat();
    }
  };

  parse(dataB, jumlahB, stabilB, statusB, jarakB);
  parse(dataC, jumlahC, stabilC, statusC, jarakC);
}

// =====================================
// KIRIM COMMAND KE SLAVE
// =====================================
void kirim(String jalur, String aksi) {
  if (slaveClient && slaveClient.connected()) {
    slaveClient.print("CMD:" + jalur + ":" + aksi + "\n");
  }
}

// =====================================
// KONTROL LAMPU A
// =====================================
void lampuA(String warna) {
  digitalWrite(LEDA_MERAH,  warna == "MERAH");
  digitalWrite(LEDA_KUNING, warna == "KUNING");
  digitalWrite(LEDA_HIJAU,  warna == "HIJAU");
  lampuA_status = warna;
  if (warna == "HIJAU") jumlahA = 0;
}

// =====================================
// SET SEMUA MERAH
// =====================================
void semuaMerah() {
  lampuA("MERAH");
  kirim("B", "MERAH");
  lampuB_status = "MERAH";
  kirim("C", "MERAH");
  lampuC_status = "MERAH";
}

// =====================================
// HITUNG BOBOT ANTRIAN PER JALUR
// =====================================
float bobotAntrian(int jumlah, bool stabil, String status) {
  float b = (float)jumlah;
  if (status == "PADAT") b += 5.0;
  if (status == "MACET") b += 15.0;
  if (stabil) b += 10.0;
  return b;
}

// =====================================
// HITUNG DURASI HIJAU ADAPTIF
// =====================================
unsigned long hitungDurasi(char jalur) {
  OverrideDurasi* ov = (jalur=='A') ? &overrideA : (jalur=='B') ? &overrideB : &overrideC;
  if (ov->aktif) {
    Serial.printf("[DURASI] %s: %lu dtk (VM override)\n", namaJalur(jalur), ov->durasi_ms/1000);
    return ov->durasi_ms;
  }

  float bA = bobotAntrian(jumlahA, stabilA, statusA);
  float bB = bobotAntrian(jumlahB, stabilB, statusB);
  float bC = bobotAntrian(jumlahC, stabilC, statusC);

  // Rata-rata bobot semua jalur
  float rata = (bA + bB + bC) / 3.0f;
  // Bobot jalur yang sedang aktif
  float bobotAktif = (jalur == 'A') ? bA : (jalur == 'B') ? bB : bC;
  // Hitung rasio; jika rata-rata = 0 (semua sepi), rasio = 1
  float rasio = (rata > 0) ? (bobotAktif / rata) : 1.0f;
  // Durasi adaptif
  unsigned long dAdaptif = constrain(
    (unsigned long)((float)DURASI_DASAR * rasio), DURASI_MIN, DURASI_MAX
  );

  BonusDurasi& b = getBonusRef(jalur);
  unsigned long bonus    = 0;
  StatusSisa    bonusSts = SISA_LANCAR;
  if (b.adaData) {
    bonus = b.ms; bonusSts = b.status;
    b.adaData = false; b.ms = 0;
  }

  unsigned long dFinal = constrain(dAdaptif + bonus, DURASI_MIN, DURASI_MAX);

  // Log ke serial
  Serial.println("─────────────────────────────");
  Serial.printf("[DURASI] %s (%s)\n", String(jalur).c_str(), namaJalur(jalur));
  Serial.printf("  Adaptif lokal : %lu dtk\n", dAdaptif / 1000);
  Serial.printf("  Bonus sisa    : +%lu dtk (%s)\n",
    bonus / 1000, bonus > 0 ? namaStatusSisa(bonusSts) : "tidak ada");
  Serial.printf("  ► TOTAL       : %lu dtk\n", dFinal / 1000);
  Serial.println("─────────────────────────────");

  return dFinal;
}

// =====================================
// TAMPILKAN INFO SISA WAKTU (tiap 1 detik)
// =====================================
void printInfo() {
  unsigned long terlewat = millis() - waktuMulai;
  long sisa = (long)durasiSekarang - (long)terlewat;
  if (sisa < 0) sisa = 0;
  Serial.println("====================");
  Serial.printf("JALUR  : %c (%s)\n", jalurAktif, namaJalur(jalurAktif));
  Serial.printf("SISA   : %ld dtk\n", sisa / 1000);
  Serial.printf("barat  : %d kend | %s | %.1f cm\n", jumlahA, statusA.c_str(), jarakA);
  Serial.printf("timur  : %d kend | %s | %.1f cm\n", jumlahB, statusB.c_str(), jarakB);
  Serial.printf("selatan: %d kend | %s | %.1f cm\n", jumlahC, statusC.c_str(), jarakC);
  if (bonusA.adaData) Serial.printf("  [barat]   bonus: +%lu dtk (%s)\n", bonusA.ms/1000, namaStatusSisa(bonusA.status));
  if (bonusB.adaData) Serial.printf("  [timur]   bonus: +%lu dtk (%s)\n", bonusB.ms/1000, namaStatusSisa(bonusB.status));
  if (bonusC.adaData) Serial.printf("  [selatan] bonus: +%lu dtk (%s)\n", bonusC.ms/1000, namaStatusSisa(bonusC.status));
  Serial.println("====================");
}

// =====================================
// LOOP UTAMA — NON-BLOCKING
// =====================================
void loop() {
  // Jaga koneksi WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Terputus! Reconnect...");
    hubungWifi();
  }
  // Jaga koneksi MQTT
  if (!mqttClient.connected()) {
    hubungMqtt();
  }
  mqttClient.loop();
  // Baca sensor & slave
  sensorA();
  bacaSlave();

  unsigned long sekarang = millis();
  // Publish MQTT semua jalur tiap INTERVAL_MQTT
  if (sekarang - lastMqttPublish >= INTERVAL_MQTT) {
    publishSensor('A');
    publishSensor('B');
    publishSensor('C');
    lastMqttPublish = sekarang;
  }
  // Jika mode darurat aktif, skip state machine
  if (modeDarurat != "OFF") return;

  switch (faseSekarang) {
    case FASE_MERAH_JEDA:
      if (sekarang - waktuMulai >= durasiSekarang) {
        // Ambil jalur sesuai urutan tetap A→B→C
        jalurAktif = urutanJalur[indexJalur];
        // Hitung durasi hijau adaptif untuk jalur ini
        durasiSekarang = hitungDurasi(jalurAktif);
        semuaMerah();

        // Nyalakan lampu
        if (jalurAktif == 'A') {
          lampuA("HIJAU");
        }
        else if (jalurAktif == 'B') {
          kirim("B","HIJAU");
          lampuB_status = "HIJAU";
        }
        else {
          kirim("C", "HIJAU");
          lampuC_status = "HIJAU";
        }

        waktuMulai   = sekarang;
        faseSekarang = FASE_HIJAU;
        Serial.printf("[HIJAU] %s | %lu dtk\n", namaJalur(jalurAktif), durasiSekarang/1000);
      }
      break;

    // ==================================
    // FASE HIJAU
    // Tahan sampai durasi adaptif habis
    // ==================================
    case FASE_HIJAU:
      if (sekarang - waktuMulai >= durasiSekarang) {
        rekamSisaAntrian(jalurAktif);
        // Ganti ke kuning
        if (jalurAktif == 'A') {lampuA("KUNING");}
        else if (jalurAktif == 'B') {kirim("B", "KUNING"); lampuB_status = "KUNING";}
        else {kirim("C", "KUNING"); lampuC_status = "KUNING";}

        waktuMulai     = sekarang;
        durasiSekarang = DURASI_KUNING;
        faseSekarang   = FASE_KUNING;
        Serial.printf("[KUNING] %s\n", namaJalur(jalurAktif));
      }
      else {
        // Cetak info tiap 1 detik
        static unsigned long lastPrint = 0;
        if (sekarang - lastPrint >= 1000) {
          printInfo();
          lastPrint = sekarang;
        }
      }
      break;

    // ==================================
    // FASE KUNING
    // Tahan 3 detik, dan maju ke jalur berikutnya
    // ==================================
    case FASE_KUNING:
      if (sekarang - waktuMulai >= durasiSekarang) {
        semuaMerah();
        // Maju ke jalur berikutnya (tetap A→B→C)
        indexJalur = (indexJalur + 1) % 3;
        waktuMulai     = sekarang;
        durasiSekarang = DURASI_JEDA;
        faseSekarang   = FASE_MERAH_JEDA;
        Serial.printf("[MERAH] Jeda → giliran berikutnya: %s\n", namaJalur(urutanJalur[indexJalur]));
      }
      break;
  }
}
