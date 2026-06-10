#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// =====================================
// KONFIGURASI WIFI
// =====================================
const char* ssid     = "JTI-POLINEMA-2G";
const char* password = "jtifast!";

// =====================================================
// KONFIGURASI MQTT
// =====================================================
const char* MQTT_SERVER    = "34.128.88.238";
const int   MQTT_PORT      = 1883;
const char* MQTT_CLIENT_ID = "smartraf-master";
const char* TOPIC_SENSOR   = "smartraf/sensor";
const char* TOPIC_KONTROL  = "smartraf/kontrol";

const char* namaJalur(char j) {
  if (j == 'A') return "barat";
  if (j == 'B') return "timur";
  return "selatan";
}

// =====================================================
// TCP SERVER untuk Slave
// =====================================================
WiFiServer tcpServer(8080);
WiFiClient slaveClient;

// =====================================
// PIN JALUR A
// =====================================
#define LEDA_MERAH   32
#define LEDA_KUNING  33
#define LEDA_HIJAU    4
#define TRIGA_PIN    25
#define ECHOA_PIN    26

// IR A — 2 sensor per jalur
// Posisi fisik:
//   [Lampu/Depan] --- [IR_KELUAR_A] --- kendaraan --- [IR_MASUK_A] --- [Ujung/Belakang]
//
//   IR_KELUAR_A : area DEPAN (dekat lampu)  → menghitung kendaraan KELUAR jalur
//   IR_MASUK_A  : area BELAKANG (ujung jalur) → menghitung kendaraan MASUK jalur
#define IR_MASUK_A   27   // BELAKANG — kendaraan masuk antrian
#define IR_KELUAR_A  14   // DEPAN    — kendaraan keluar jalur (melewati lampu)

// =====================================
// KONSTANTA WAKTU (milidetik)
// =====================================
#define DURASI_DASAR    15000UL
#define DURASI_MIN      10000UL
#define DURASI_MAX      45000UL
#define DURASI_KUNING    3000UL
#define DURASI_JEDA       500UL
#define INTERVAL_MQTT     500UL

// ─────────────────────────────────────────────────────
// THRESHOLD REAL-TIME — disesuaikan jalur 25cm
//
// HC-SR04 menghadap ke arah datang kendaraan:
//   Jarak jauh  = antrian panjang = MACET
//   Jarak dekat = hampir kosong   = LANCAR
//
//   < 8cm  → LANCAR  (kosong / 1 kend dekat)
//   8–18cm → PADAT   (antrian sedang)
//   > 18cm → MACET   (antrian hampir penuh)
//   ≥ 24cm → paksa LANCAR (ujung jalur / timeout)
// ─────────────────────────────────────────────────────
#define RT_PADAT_CM    8.0f
#define RT_MACET_CM   18.0f
#define RT_MAX_CM     24.0f

// ─────────────────────────────────────────────────────
// THRESHOLD SISA ANTRIAN — pasca hijau, skala 25cm
//   < 5cm  → LANCAR (+0 detik)
//   5–12cm → PADAT  (+5 detik)
//   > 12cm → MACET  (+10 detik)
// ─────────────────────────────────────────────────────
#define SISA_PADAT_CM    5.0f
#define SISA_MACET_CM   12.0f
#define SISA_KEND_SEDIKIT   2
#define SISA_KEND_PADAT     5
#define BONUS_PADAT_MS    5000UL
#define BONUS_MACET_MS   10000UL

#define IR_DEBOUNCE_MS  300UL

// ─────────────────────────────────────────────────────
// ENUM & STRUCT
// ─────────────────────────────────────────────────────
enum StatusSisa { SISA_LANCAR = 0, SISA_PADAT = 1, SISA_MACET = 2 };

struct BonusDurasi {
  bool          adaData   = false;
  unsigned long ms        = 0;
  StatusSisa    status    = SISA_LANCAR;
  int           sisaKend  = 0;
  float         sisaJarak = 0.0f;
};
BonusDurasi bonusA, bonusB, bonusC;

// =====================================
// STATE MACHINE
// =====================================
enum Fase { FASE_MERAH_JEDA, FASE_HIJAU, FASE_KUNING };

Fase          faseSekarang   = FASE_MERAH_JEDA;
char          jalurAktif     = 'A';
unsigned long waktuMulai     = 0;
unsigned long durasiSekarang = 0;
int           indexJalur     = 0;
const char    urutanJalur[3] = {'A', 'B', 'C'};

// =====================================
// VARIABEL SENSOR A — JALUR BARAT
//
// jumlahMasukA : kendaraan yang memasuki antrian (IR Masuk)
// sudahLewatA  : kendaraan yang sudah melewati lampu (IR Keluar)
// sisaA        : masukA - lewatA = masih di jalur
// =====================================
int    jumlahMasukA = 0;
int    sudahLewatA  = 0;
int    sisaA        = 0;
bool   stabilA      = false;
String statusA      = "LANCAR";
float  jarakA       = 0.0f;
unsigned long startMacetA       = 0;
unsigned long lastIRMasukTrigA  = 0;
unsigned long lastIRKeluarTrigA = 0;
bool lastIRMasukA  = HIGH;
bool lastIRKeluarA = HIGH;

// =====================================
// DATA DARI SLAVE (B & C)
// Format: masuk, lewat, sisa, stabil, status, jarak
// =====================================
int    jumlahMasukB = 0, jumlahMasukC = 0;
int    sudahLewatB  = 0, sudahLewatC  = 0;   // ← tambah: kendaraan keluar B & C
int    sisaB = 0, sisaC = 0;
bool   stabilB = false, stabilC = false;
String statusB = "LANCAR", statusC = "LANCAR";
float  jarakB  = 0.0f, jarakC = 0.0f;

// =====================================
// STATUS LAMPU
// =====================================
String lampuA_status = "MERAH";
String lampuB_status = "MERAH";
String lampuC_status = "MERAH";

// =====================================
// OVERRIDE & DARURAT
// =====================================
struct OverrideDurasi {
  bool          aktif     = false;
  unsigned long durasi_ms = 0;
};
OverrideDurasi overrideA, overrideB, overrideC;
String modeDarurat = "OFF";

// =====================================
// MQTT & WIFI
// =====================================
WiFiClient   wifiMqttClient;
PubSubClient mqttClient(wifiMqttClient);
unsigned long lastMqttPublish = 0;

// =====================================
// FORWARD DECLARATION
// =====================================
void          lampuA(String warna);
void          semuaMerah();
void          kirim(String jalur, String aksi);
void          bacaSlave();
void          sensorA();
void          printInfo();
float         ultrasonikA();
unsigned long hitungDurasi(char jalur);
float         bobotAntrian(int sisa, bool stabil, String status);
void          hubungWifi();
void          hubungMqtt();
void          mqttCallback(char* topic, byte* payload, unsigned int length);
void          publishSensor(char jalur);
void          rekamSisaAntrian(char jalur);
StatusSisa    klasifikasiSisaJarak(float jarak);
StatusSisa    klasifikasiSisaJumlah(int sisa);
StatusSisa    klasifikasiSisa(float jarak, int sisa);
unsigned long bonusUntukStatus(StatusSisa s);
const char*   namaStatusSisa(StatusSisa s);
void          publishSisaAntrian(char jalur, BonusDurasi& b);
BonusDurasi&  getBonusRef(char jalur);

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
  pinMode(IR_MASUK_A,  INPUT);
  pinMode(IR_KELUAR_A, INPUT);

  lampuA("MERAH");
  hubungWifi();

  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  hubungMqtt();
  tcpServer.begin();

  waktuMulai     = millis();
  durasiSekarang = DURASI_JEDA;
  faseSekarang   = FASE_MERAH_JEDA;

  Serial.println("====================================================");
  Serial.println("  MASTER SMARTRAF SIAP  (2 IR per jalur)");
  Serial.print  ("  IP WiFi  : "); Serial.println(WiFi.localIP());
  Serial.println("  TCP Slave : port 8080");
  Serial.println("  A=barat | B=timur | C=selatan");
  Serial.println("  Layout : [Lampu/DEPAN]-[IR Keluar/DEPAN]-kend-[IR Masuk/BELAKANG]-[Ultrasonik]");
  Serial.println("  IR DEPAN  = IR Keluar = hitung kendaraan KELUAR jalur");
  Serial.println("  IR BELAKANG = IR Masuk  = hitung kendaraan MASUK jalur");
  Serial.println("  RT: <8cm=LANCAR | 8-18cm=PADAT | >18cm=MACET | >=24cm=KOSONG");
  Serial.println("====================================================");
}

// =====================================================
// KONEKSI WIFI & MQTT
// =====================================================
void hubungWifi() {
  Serial.print("[WiFi] Menghubungkan ke "); Serial.println(ssid);
  WiFi.begin(ssid, password);
  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - t > 15000) { WiFi.begin(ssid, password); t = millis(); }
    delay(500); Serial.print(".");
  }
  Serial.println("\n[WiFi] Terhubung: " + WiFi.localIP().toString());
}

void hubungMqtt() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Menghubungkan...");
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println(" Terhubung!");
      mqttClient.subscribe(TOPIC_KONTROL);
    } else {
      Serial.print(" Gagal rc="); Serial.print(mqttClient.state());
      Serial.println(", retry 3s..."); delay(3000);
    }
  }
}

// =====================================================
// CALLBACK MQTT
// =====================================================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.println("[MQTT] " + msg);

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
    Serial.println("[DARURAT] " + jalur + " dipaksa HIJAU");
  }
  else if (perintah == "DARURAT_OFF") {
    if (modeDarurat != "OFF") {
      modeDarurat = "OFF"; semuaMerah();
      waktuMulai = millis(); durasiSekarang = DURASI_JEDA; faseSekarang = FASE_MERAH_JEDA;
      Serial.println("[DARURAT] Mode Normal aktif");
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
// PUBLISH SENSOR
// Field baru: jumlah_masuk, sudah_lewat, sisa_antrian
// =====================================================
void publishSensor(char jalur) {
  StaticJsonDocument<300> doc;
  doc["pers_id"]    = "simpang-utama";
  doc["jalur_arah"] = namaJalur(jalur);
  doc["tipe"]       = "sensor";

  if (jalur == 'A') {
    doc["jarak_cm"]         = (int)jarakA;
    doc["jumlah_masuk"]     = jumlahMasukA;
    doc["sudah_lewat"]      = sudahLewatA;
    doc["sisa_antrian"]     = sisaA;
    doc["status_kepadatan"] = statusA;
    doc["status_lampu"]     = lampuA_status;
  } else if (jalur == 'B') {
    doc["jarak_cm"]         = (int)jarakB;
    doc["jumlah_masuk"]     = jumlahMasukB;
    doc["sudah_lewat"]      = sudahLewatB;   // langsung dari data slave
    doc["sisa_antrian"]     = sisaB;
    doc["status_kepadatan"] = statusB;
    doc["status_lampu"]     = lampuB_status;
  } else {
    doc["jarak_cm"]         = (int)jarakC;
    doc["jumlah_masuk"]     = jumlahMasukC;
    doc["sudah_lewat"]      = sudahLewatC;   // langsung dari data slave
    doc["sisa_antrian"]     = sisaC;
    doc["status_kepadatan"] = statusC;
    doc["status_lampu"]     = lampuC_status;
  }

  unsigned long terlewat = millis() - waktuMulai;
  long sisa = (long)durasiSekarang - (long)terlewat;
  doc["sisa_waktu_detik"]   = (sisa > 0) ? (int)(sisa / 1000) : 0;
  doc["durasi_total_detik"] = durasiSekarang / 1000;
  doc["jalur_aktif"]        = String(jalurAktif);
  doc["fase"] = (faseSekarang == FASE_HIJAU) ? "HIJAU" :
                (faseSekarang == FASE_KUNING) ? "KUNING" : "MERAH";

  char buf[300]; serializeJson(doc, buf);
  mqttClient.publish(TOPIC_SENSOR, buf);
}

// =====================================================
// DETEKSI SISA ANTRIAN
// =====================================================
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

StatusSisa klasifikasiSisaJarak(float jarak) {
  if (jarak < SISA_PADAT_CM) return SISA_LANCAR;
  if (jarak < SISA_MACET_CM) return SISA_PADAT;
  return SISA_MACET;
}

StatusSisa klasifikasiSisaJumlah(int sisa) {
  if (sisa <= SISA_KEND_SEDIKIT) return SISA_LANCAR;
  if (sisa <= SISA_KEND_PADAT)   return SISA_PADAT;
  return SISA_MACET;
}

StatusSisa klasifikasiSisa(float jarak, int sisa) {
  return (StatusSisa)max(
    (int)klasifikasiSisaJarak(jarak),
    (int)klasifikasiSisaJumlah(sisa)
  );
}

unsigned long bonusUntukStatus(StatusSisa s) {
  if (s == SISA_MACET) return BONUS_MACET_MS;
  if (s == SISA_PADAT) return BONUS_PADAT_MS;
  return 0UL;
}

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

  Serial.printf("[SISA] %s | jarak=%.1fcm | sisa=%dkend | %s | bonus=+%ddetik\n",
    namaJalur(jalur), b.sisaJarak, b.sisaKend,
    namaStatusSisa(b.status), (int)(b.ms / 1000));
}

void rekamSisaAntrian(char jalur) {
  BonusDurasi& b = getBonusRef(jalur);
  if (jalur == 'A') {
    b.sisaJarak = ultrasonikA();
    b.sisaKend  = sisaA;      // pakai sisa (masuk - lewat)
  } else if (jalur == 'B') {
    b.sisaJarak = jarakB; b.sisaKend = sisaB;
  } else {
    b.sisaJarak = jarakC; b.sisaKend = sisaC;
  }
  b.status  = klasifikasiSisa(b.sisaJarak, b.sisaKend);
  b.ms      = bonusUntukStatus(b.status);
  b.adaData = true;
  publishSisaAntrian(jalur, b);
}

// =====================================================
// ULTRASONIK A
// =====================================================
float ultrasonikA() {
  digitalWrite(TRIGA_PIN, LOW);  delayMicroseconds(2);
  digitalWrite(TRIGA_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIGA_PIN, LOW);
  long dur = pulseIn(ECHOA_PIN, HIGH, 30000);
  if (dur == 0) return 25.0f;   // timeout = anggap ujung jalur
  return dur * 0.034f / 2.0f;
}

// =====================================================
// SENSOR A — 2 IR
//
// Layout fisik jalur BARAT:
//   [Lampu/DEPAN] --[IR_KELUAR_A]-- kendaraan --[IR_MASUK_A]-- [Ujung/BELAKANG]
//
//   IR_MASUK_A  (BELAKANG) → jumlahMasukA++ : kendaraan memasuki antrian dari belakang
//   IR_KELUAR_A (DEPAN)    → sudahLewatA++  : kendaraan keluar jalur melewati lampu
//   sisaA = jumlahMasukA - sudahLewatA       : estimasi kendaraan masih di jalur
// =====================================================
void sensorA() {
  // ── IR MASUK — BELAKANG JALUR (kendaraan datang masuk antrian) ──────────────
  bool irMasuk = digitalRead(IR_MASUK_A);
  if (irMasuk == LOW && lastIRMasukA == HIGH &&
      millis() - lastIRMasukTrigA > IR_DEBOUNCE_MS) {
    jumlahMasukA++;
    sisaA = jumlahMasukA - sudahLewatA;
    if (sisaA < 0) sisaA = 0;
    lastIRMasukTrigA = millis();
    Serial.printf("[IR-MASUK-A] masuk=%d lewat=%d sisa=%d\n",
                  jumlahMasukA, sudahLewatA, sisaA);
  }
  lastIRMasukA = irMasuk;

  // ── IR KELUAR — DEPAN JALUR (kendaraan keluar melewati lampu) ─────────────
  bool irKeluar = digitalRead(IR_KELUAR_A);
  if (irKeluar == LOW && lastIRKeluarA == HIGH &&
      millis() - lastIRKeluarTrigA > IR_DEBOUNCE_MS) {
    sudahLewatA++;
    sisaA = jumlahMasukA - sudahLewatA;
    if (sisaA < 0) sisaA = 0;
    lastIRKeluarTrigA = millis();
    Serial.printf("[IR-KELUAR-A] masuk=%d lewat=%d sisa=%d\n",
                  jumlahMasukA, sudahLewatA, sisaA);
  }
  lastIRKeluarA = irKeluar;

  // ── ULTRASONIK ──────────────────────────────────
  jarakA = ultrasonikA();

  if (jarakA >= RT_MAX_CM) {
    statusA = "LANCAR"; stabilA = false; startMacetA = 0;
  }
  else if (jarakA < RT_PADAT_CM) {
    statusA = "LANCAR"; stabilA = false; startMacetA = 0;
  }
  else if (jarakA < RT_MACET_CM) {
    statusA = "PADAT"; stabilA = false; startMacetA = 0;
  }
  else {
    if (startMacetA == 0) startMacetA = millis();
    if (millis() - startMacetA >= 5000) { stabilA = true; statusA = "MACET"; }
    else statusA = "PADAT";
  }
}

// =====================================================
// BACA DATA SLAVE (TCP)
//
// FORMAT BARU (2 IR):
//   B:masuk:lewat:sisa:stabil:status:jarak|C:masuk:lewat:sisa:stabil:status:jarak
// =====================================================
void bacaSlave() {
  if (!slaveClient || !slaveClient.connected()) {
    WiFiClient c = tcpServer.available();
    if (c) { slaveClient = c; Serial.println("[TCP] Slave: " + slaveClient.remoteIP().toString()); }
    return;
  }
  if (!slaveClient.available()) return;

  String data = slaveClient.readStringUntil('\n');
  data.trim(); if (data.length() == 0) return;
  int p = data.indexOf('|'); if (p == -1) return;

  String dB = data.substring(0, p);
  String dC = data.substring(p + 1);

  // Parse: X:masuk:lewat:sisa:stabil:status:jarak
  auto parse = [](const String& d, int& masuk, int& lewat, int& sisa, bool& stabil, String& status, float& jarak) {
    int i1 = d.indexOf(':');
    int i2 = d.indexOf(':', i1+1);   // lewat
    int i3 = d.indexOf(':', i2+1);   // sisa
    int i4 = d.indexOf(':', i3+1);   // stabil
    int i5 = d.indexOf(':', i4+1);   // status
    int i6 = d.indexOf(':', i5+1);   // jarak
    if (i1<0||i2<0||i3<0||i4<0||i5<0||i6<0) return;
    masuk  = d.substring(i1+1, i2).toInt();
    lewat  = d.substring(i2+1, i3).toInt();   // ← ambil nilai lewat dari slave
    sisa   = d.substring(i3+1, i4).toInt();
    stabil = d.substring(i4+1, i5).toInt();
    status = d.substring(i5+1, i6);
    jarak  = d.substring(i6+1).toFloat();
  };

  parse(dB, jumlahMasukB, sudahLewatB, sisaB, stabilB, statusB, jarakB);
  parse(dC, jumlahMasukC, sudahLewatC, sisaC, stabilC, statusC, jarakC);
}

// =====================================================
// KONTROL LAMPU & SLAVE
// =====================================================
void kirim(String jalur, String aksi) {
  if (slaveClient && slaveClient.connected())
    slaveClient.print("CMD:" + jalur + ":" + aksi + "\n");
}

void lampuA(String warna) {
  digitalWrite(LEDA_MERAH,  warna == "MERAH");
  digitalWrite(LEDA_KUNING, warna == "KUNING");
  digitalWrite(LEDA_HIJAU,  warna == "HIJAU");
  lampuA_status = warna;
  // jumlahMasuk dan sudahLewat adalah akumulasi harian — TIDAK direset per siklus
  // sisaA = jumlahMasukA - sudahLewatA dihitung real-time dari kedua IR sensor
  // Reset harian bisa dilakukan secara manual atau otomatis via MQTT perintah RESET
}

void semuaMerah() {
  lampuA("MERAH");
  kirim("B","MERAH"); lampuB_status = "MERAH";
  kirim("C","MERAH"); lampuC_status = "MERAH";
}

// =====================================================
// BOBOT ANTRIAN — berbasis sisaKend (masuk - lewat)
// =====================================================
float bobotAntrian(int sisa, bool stabil, String status) {
  if (sisa == 0 && status == "LANCAR") return 0.0f;
  float b = (float)sisa;
  if (status == "PADAT") b += 5.0f;
  if (status == "MACET") b += 15.0f;
  if (stabil)            b += 10.0f;
  return b;
}

// =====================================================
// HITUNG DURASI HIJAU
// =====================================================
unsigned long hitungDurasi(char jalur) {
  OverrideDurasi* ov = (jalur=='A') ? &overrideA : (jalur=='B') ? &overrideB : &overrideC;
  if (ov->aktif) {
    Serial.printf("[DURASI] %s: %lus (VM override)\n", namaJalur(jalur), ov->durasi_ms/1000);
    return ov->durasi_ms;
  }

  float bA   = bobotAntrian(sisaA, stabilA, statusA);
  float bB   = bobotAntrian(sisaB, stabilB, statusB);
  float bC   = bobotAntrian(sisaC, stabilC, statusC);
  float rata = (bA + bB + bC) / 3.0f;
  float bobotAktif = (jalur=='A') ? bA : (jalur=='B') ? bB : bC;
  float rasio = (rata > 0) ? (bobotAktif / rata) : 1.0f;

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

  Serial.printf("[DURASI] %s | adaptif=%lus | bonus=+%lus(%s) | TOTAL=%lus\n",
    namaJalur(jalur), dAdaptif/1000, bonus/1000,
    bonus > 0 ? namaStatusSisa(bonusSts) : "-", dFinal/1000);

  return dFinal;
}

// =====================================================
// PRINT INFO — satu baris per jalur, ringkas
// =====================================================
void printInfo() {
  unsigned long terlewat = millis() - waktuMulai;
  long sisa = (long)durasiSekarang - (long)terlewat;
  if (sisa < 0) sisa = 0;

  Serial.printf("[INFO] %s(%s) sisa=%lds\n",
    String(jalurAktif).c_str(), namaJalur(jalurAktif), sisa/1000);
  Serial.printf("  barat  : masuk=%-3d lewat=%-3d SISA=%-3d | %s | %.1fcm\n",
    jumlahMasukA, sudahLewatA, sisaA, statusA.c_str(), jarakA);
  Serial.printf("  timur  : masuk=%-3d lewat=%-3d SISA=%-3d | %s | %.1fcm\n",
    jumlahMasukB, sudahLewatB, sisaB, statusB.c_str(), jarakB);
  Serial.printf("  selatan: masuk=%-3d lewat=%-3d SISA=%-3d | %s | %.1fcm\n",
    jumlahMasukC, sudahLewatC, sisaC, statusC.c_str(), jarakC);

  if (bonusA.adaData || bonusB.adaData || bonusC.adaData) {
    Serial.print("  bonus:");
    if (bonusA.adaData) Serial.printf(" barat+%lus", bonusA.ms/1000);
    if (bonusB.adaData) Serial.printf(" timur+%lus", bonusB.ms/1000);
    if (bonusC.adaData) Serial.printf(" selatan+%lus", bonusC.ms/1000);
    Serial.println();
  }
}

// =====================================
// LOOP UTAMA
// =====================================
void loop() {
  if (WiFi.status() != WL_CONNECTED) { Serial.println("[WiFi] Reconnect..."); hubungWifi(); }
  if (!mqttClient.connected()) hubungMqtt();
  mqttClient.loop();

  sensorA();
  bacaSlave();

  unsigned long sekarang = millis();

  if (sekarang - lastMqttPublish >= INTERVAL_MQTT) {
    publishSensor('A'); publishSensor('B'); publishSensor('C');
    lastMqttPublish = sekarang;
  }

  if (modeDarurat != "OFF") return;

  switch (faseSekarang) {

    case FASE_MERAH_JEDA:
      if (sekarang - waktuMulai >= durasiSekarang) {
        jalurAktif     = urutanJalur[indexJalur];
        durasiSekarang = hitungDurasi(jalurAktif);
        semuaMerah();

        if      (jalurAktif == 'A') { lampuA("HIJAU"); }
        else if (jalurAktif == 'B') { kirim("B","HIJAU"); lampuB_status = "HIJAU"; }
        else                        { kirim("C","HIJAU"); lampuC_status = "HIJAU"; }

        waktuMulai = sekarang; faseSekarang = FASE_HIJAU;
        Serial.printf("[HIJAU] %s | %lus\n", namaJalur(jalurAktif), durasiSekarang/1000);
      }
      break;

    case FASE_HIJAU:
      if (sekarang - waktuMulai >= durasiSekarang) {
        rekamSisaAntrian(jalurAktif);

        if      (jalurAktif == 'A') { lampuA("KUNING"); }
        else if (jalurAktif == 'B') { kirim("B","KUNING"); lampuB_status = "KUNING"; }
        else                        { kirim("C","KUNING"); lampuC_status = "KUNING"; }

        waktuMulai = sekarang; durasiSekarang = DURASI_KUNING; faseSekarang = FASE_KUNING;
        Serial.printf("[KUNING] %s\n", namaJalur(jalurAktif));
      } else {
        static unsigned long lastPrint = 0;
        if (sekarang - lastPrint >= 1000) { printInfo(); lastPrint = sekarang; }
      }
      break;

    case FASE_KUNING:
      if (sekarang - waktuMulai >= durasiSekarang) {
        semuaMerah();
        indexJalur     = (indexJalur + 1) % 3;
        waktuMulai     = sekarang;
        durasiSekarang = DURASI_JEDA;
        faseSekarang   = FASE_MERAH_JEDA;
        Serial.printf("[MERAH] Jeda → %s\n", namaJalur(urutanJalur[indexJalur]));
      }
      break;
  }
}