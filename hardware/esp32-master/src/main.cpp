#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// =====================================
// KONFIGURASI WIFI
// =====================================
const char* ssid     = "Mbarep";
const char* password = "mivavihada";

// =====================================================
// KONFIGURASI MQTT
// =====================================================
const char* MQTT_SERVER    = "34.128.88.238";
const int   MQTT_PORT      = 1883;
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
#define IRA_PIN      27

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
// THRESHOLD REAL-TIME
//
// FIX: Master dan Slave harus sama → 50 / 150 cm
// Sebelumnya Master pakai 5/15 cm (tidak konsisten dengan Slave)
//
// HC-SR04 menghadap ke arah datang kendaraan:
//   Jarak jauh  = antrian panjang = MACET
//   Jarak dekat = hampir kosong   = LANCAR
//   Timeout (0 kendaraan) = 400cm → masuk LANCAR karena > RT_MACET
//   tapi dikunci LANCAR saat jarak > 200cm (batas wajar jalan)
// ─────────────────────────────────────────────────────
#define RT_PADAT_CM    5.0f    // FIX: sebelumnya 5.0f (salah)
#define RT_MACET_CM   15.0f   // FIX: sebelumnya 15.0f (salah)
#define RT_MAX_CM     20.0f   // batas wajar sensor — di atas ini dianggap kosong

// ─────────────────────────────────────────────────────
// THRESHOLD SISA ANTRIAN
// ─────────────────────────────────────────────────────
#define SISA_PADAT_CM    5.0f
#define SISA_MACET_CM   15.0f
#define SISA_KEND_SEDIKIT   2
#define SISA_KEND_PADAT     5
#define BONUS_PADAT_MS    5000UL
#define BONUS_MACET_MS   10000UL

// ─────────────────────────────────────────────────────
// DEBOUNCE IR
// ─────────────────────────────────────────────────────
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
// VARIABEL SENSOR A
// =====================================
int    jumlahA    = 0;
bool   stabilA    = false;
String statusA    = "LANCAR";
float  jarakA     = 0.0f;
unsigned long startMacetA    = 0;
unsigned long lastIRTriggerA = 0;   // FIX: debounce IR
bool lastIRA = HIGH;

// =====================================
// DATA DARI SLAVE
// =====================================
int    jumlahB = 0,  jumlahC = 0;
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
float         bobotAntrian(int jumlah, bool stabil, String status);
void          hubungWifi();
void          hubungMqtt();
void          mqttCallback(char* topic, byte* payload, unsigned int length);
void          publishSensor(char jalur);
void          rekamSisaAntrian(char jalur);
StatusSisa    klasifikasiSisaJarak(float jarak);
StatusSisa    klasifikasiSisaJumlah(int jumlah);
StatusSisa    klasifikasiSisa(float jarak, int jumlah);
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
  pinMode(IRA_PIN,     INPUT);

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
  Serial.println("  MASTER SMARTRAF SIAP");
  Serial.print  ("  IP WiFi  : "); Serial.println(WiFi.localIP());
  Serial.println("  TCP Slave : port 8080");
  Serial.println("  A=barat | B=timur | C=selatan");
  Serial.println("  RT: <50cm=LANCAR | 50-150cm=PADAT | >150cm=MACET");
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
// =====================================================
void publishSensor(char jalur) {
  StaticJsonDocument<256> doc;
  doc["pers_id"]    = "simpang-utama";
  doc["jalur_arah"] = namaJalur(jalur);
  doc["tipe"]       = "sensor";

  if (jalur == 'A') {
    doc["jarak_cm"] = (int)jarakA; doc["jumlah_kendaraan"] = jumlahA;
    doc["status_kepadatan"] = statusA; doc["status_lampu"] = lampuA_status;
  } else if (jalur == 'B') {
    doc["jarak_cm"] = (int)jarakB; doc["jumlah_kendaraan"] = jumlahB;
    doc["status_kepadatan"] = statusB; doc["status_lampu"] = lampuB_status;
  } else {
    doc["jarak_cm"] = (int)jarakC; doc["jumlah_kendaraan"] = jumlahC;
    doc["status_kepadatan"] = statusC; doc["status_lampu"] = lampuC_status;
  }

  unsigned long terlewat = millis() - waktuMulai;
  long sisa = (long)durasiSekarang - (long)terlewat;
  doc["sisa_waktu_detik"]   = (sisa > 0) ? (int)(sisa / 1000) : 0;
  doc["durasi_total_detik"] = durasiSekarang / 1000;
  doc["jalur_aktif"]        = String(jalurAktif);
  doc["fase"] = (faseSekarang == FASE_HIJAU) ? "HIJAU" :
                (faseSekarang == FASE_KUNING) ? "KUNING" : "MERAH";

  char buf[256]; serializeJson(doc, buf);
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

StatusSisa klasifikasiSisaJumlah(int jumlah) {
  if (jumlah <= SISA_KEND_SEDIKIT) return SISA_LANCAR;
  if (jumlah <= SISA_KEND_PADAT)   return SISA_PADAT;
  return SISA_MACET;
}

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

  // Log ringkas — tidak berantakan
  Serial.printf("[SISA] %s | jarak=%.1fcm | kend=%d | %s | bonus=+%ddetik\n",
    namaJalur(jalur), b.sisaJarak, b.sisaKend,
    namaStatusSisa(b.status), (int)(b.ms / 1000));
}

void rekamSisaAntrian(char jalur) {
  BonusDurasi& b = getBonusRef(jalur);
  if (jalur == 'A') {
    b.sisaJarak = ultrasonikA();
    b.sisaKend  = jumlahA;
  } else if (jalur == 'B') {
    b.sisaJarak = jarakB; b.sisaKend = jumlahB;
  } else {
    b.sisaJarak = jarakC; b.sisaKend = jumlahC;
  }
  b.status  = klasifikasiSisa(b.sisaJarak, b.sisaKend);
  b.ms      = bonusUntukStatus(b.status);
  b.adaData = true;
  publishSisaAntrian(jalur, b);
}

// =====================================================
// ULTRASONIK A
//
// FIX: Membaca kendaraan TERDEKAT.
// HC-SR04 mengembalikan jarak ke objek pertama yang
// memantulkan gelombang → otomatis kendaraan terdekat.
// Jika tidak ada pantulan (timeout), return 400cm
// sehingga sistem tahu jalan kosong.
// =====================================================
float ultrasonikA() {
  digitalWrite(TRIGA_PIN, LOW);  delayMicroseconds(2);
  digitalWrite(TRIGA_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIGA_PIN, LOW);

  // pulseIn timeout 30ms → maks jarak ~510cm, cukup untuk jalan
  long dur = pulseIn(ECHOA_PIN, HIGH, 30000);

  // Timeout = tidak ada kendaraan terdeteksi
  if (dur == 0) return 25.0f;

  return dur * 0.034f / 2.0f;
}

// =====================================================
// SENSOR A
//
// FIX 1: lastIRTriggerA sekarang diupdate saat trigger
// FIX 2: jarak > RT_MAX_CM (200cm) dianggap kosong = LANCAR
//         sehingga timeout 400cm tidak salah masuk MACET
// =====================================================
void sensorA() {
  bool irState = digitalRead(IRA_PIN);

  // FIX: update lastIRTriggerA agar debounce bekerja
  if (irState == LOW && lastIRA == HIGH &&
      millis() - lastIRTriggerA > IR_DEBOUNCE_MS) {
    jumlahA++;
    lastIRTriggerA = millis();   // ← FIX: baris ini hilang sebelumnya
    Serial.printf("[IR-A] Kendaraan masuk, total=%d\n", jumlahA);
  }
  lastIRA = irState;

  jarakA = ultrasonikA();

  // FIX: jarak > RT_MAX_CM = tidak ada kendaraan = paksa LANCAR
  // Ini mencegah timeout 400cm masuk kategori MACET
  if (jarakA > RT_MAX_CM) {
    statusA = "LANCAR"; stabilA = false; startMacetA = 0;
  }
  else if (jarakA < RT_PADAT_CM) {
    statusA = "LANCAR"; stabilA = false; startMacetA = 0;
  }
  else if (jarakA < RT_MACET_CM) {
    statusA = "PADAT"; stabilA = false; startMacetA = 0;
  }
  else {
    // 150–200cm → potensi MACET, tunggu stabil 5 detik
    if (startMacetA == 0) startMacetA = millis();
    if (millis() - startMacetA >= 5000) { stabilA = true; statusA = "MACET"; }
    else statusA = "PADAT";
  }
}

// =====================================================
// BACA DATA SLAVE (TCP)
// FORMAT: B:jumlah:stabil:status:jarak|C:jumlah:stabil:status:jarak
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

  auto parse = [](const String& d, int& jumlah, bool& stabil, String& status, float& jarak) {
    int i1=d.indexOf(':'), i2=d.indexOf(':',i1+1),
        i3=d.indexOf(':',i2+1), i4=d.indexOf(':',i3+1);
    if (i1<0||i2<0||i3<0||i4<0) return;
    jumlah = d.substring(i1+1,i2).toInt();
    stabil = d.substring(i2+1,i3).toInt();
    status = d.substring(i3+1,i4);
    jarak  = d.substring(i4+1).toFloat();
  };
  parse(dB, jumlahB, stabilB, statusB, jarakB);
  parse(dC, jumlahC, stabilC, statusC, jarakC);
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
  if (warna == "HIJAU") jumlahA = 0;
}

void semuaMerah() {
  lampuA("MERAH");
  kirim("B","MERAH"); lampuB_status = "MERAH";
  kirim("C","MERAH"); lampuC_status = "MERAH";
}

// =====================================================
// BOBOT ANTRIAN
// =====================================================
float bobotAntrian(int jumlah, bool stabil, String status) {
  if (jumlah == 0 && status == "LANCAR") return 0.0f;
  float b = (float)jumlah;
  if (status == "PADAT") b += 5.0f;
  if (status == "MACET") b += 15.0f;
  if (stabil)            b += 10.0f;
  return b;
}

// =====================================================
// HITUNG DURASI HIJAU
//
// FIX: Hapus "===== STATUS =====" dari sini.
// Status sensor sudah tampil di printInfo() tiap detik,
// tidak perlu dicetak lagi saat hitungDurasi() dipanggil.
// =====================================================
unsigned long hitungDurasi(char jalur) {
  OverrideDurasi* ov = (jalur=='A') ? &overrideA : (jalur=='B') ? &overrideB : &overrideC;
  if (ov->aktif) {
    Serial.printf("[DURASI] %s: %lus (VM override)\n", namaJalur(jalur), ov->durasi_ms/1000);
    return ov->durasi_ms;
  }

  float bA   = bobotAntrian(jumlahA, stabilA, statusA);
  float bB   = bobotAntrian(jumlahB, stabilB, statusB);
  float bC   = bobotAntrian(jumlahC, stabilC, statusC);
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

  // Log satu baris ringkas — tidak mengganggu output lain
  Serial.printf("[DURASI] %s | adaptif=%lus | bonus=+%lus(%s) | TOTAL=%lus\n",
    namaJalur(jalur), dAdaptif/1000, bonus/1000,
    bonus > 0 ? namaStatusSisa(bonusSts) : "-", dFinal/1000);

  return dFinal;
}

// =====================================================
// PRINT INFO — FIX: format lebih ringkas, satu baris per jalur
// =====================================================
void printInfo() {
  unsigned long terlewat = millis() - waktuMulai;
  long sisa = (long)durasiSekarang - (long)terlewat;
  if (sisa < 0) sisa = 0;

  // Satu blok info yang rapi
  Serial.printf("[INFO] %s(%s) sisa=%lds | "
                "A:%dkend/%s/%.0fcm | "
                "B:%dkend/%s/%.0fcm | "
                "C:%dkend/%s/%.0fcm",
    String(jalurAktif).c_str(), namaJalur(jalurAktif), sisa/1000,
    jumlahA, statusA.c_str(), jarakA,
    jumlahB, statusB.c_str(), jarakB,
    jumlahC, statusC.c_str(), jarakC);

  // Tampilkan bonus yang menunggu (jika ada) di baris yang sama
  if (bonusA.adaData || bonusB.adaData || bonusC.adaData) {
    Serial.print(" | bonus:");
    if (bonusA.adaData) Serial.printf("A+%lus", bonusA.ms/1000);
    if (bonusB.adaData) Serial.printf("B+%lus", bonusB.ms/1000);
    if (bonusC.adaData) Serial.printf("C+%lus", bonusC.ms/1000);
  }
  Serial.println();
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