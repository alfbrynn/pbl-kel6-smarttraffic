#include <Arduino.h>
#include <WiFi.h>

// =====================================
// KONFIGURASI WIFI
// =====================================
const char* ssid     = "Hotspot";
const char* password = "qwerty234";

IPAddress serverIP(192, 168, 71, 100);   // Ganti IP Master
const int  serverPort = 8080;

WiFiClient client;

// =====================================
// PIN LED B (jalur timur)
// =====================================
#define LEDB_MERAH  16
#define LEDB_KUNING 17
#define LEDB_HIJAU  18

// =====================================
// PIN LED C (jalur selatan)
// =====================================
#define LEDC_MERAH  23
#define LEDC_KUNING 25
#define LEDC_HIJAU  32

// =====================================
// PIN SENSOR B
// Ultrasonik
#define TRIGB_PIN    14
#define ECHOB_PIN    27
// IR B — 2 sensor per jalur
// Posisi fisik:
//   [Lampu/DEPAN] --- [IR_KELUAR_B] --- kendaraan --- [IR_MASUK_B] --- [Ujung/BELAKANG]
//
//   IR_KELUAR_B : area DEPAN (dekat lampu)    → hitung kendaraan KELUAR jalur
//   IR_MASUK_B  : area BELAKANG (ujung jalur) → hitung kendaraan MASUK jalur
#define IR_MASUK_B   26   // BELAKANG — kendaraan masuk antrian
#define IR_KELUAR_B  33   // DEPAN    — kendaraan keluar jalur (melewati lampu)

// =====================================
// PIN SENSOR C
#define TRIGC_PIN    19
#define ECHOC_PIN    21
// IR C — 2 sensor per jalur
// Posisi fisik:
//   [Lampu/DEPAN] --- [IR_KELUAR_C] --- kendaraan --- [IR_MASUK_C] --- [Ujung/BELAKANG]
//
//   IR_KELUAR_C : area DEPAN (dekat lampu)    → hitung kendaraan KELUAR jalur
//   IR_MASUK_C  : area BELAKANG (ujung jalur) → hitung kendaraan MASUK jalur
#define IR_MASUK_C   22   // BELAKANG — kendaraan masuk antrian
#define IR_KELUAR_C  34   // DEPAN    — kendaraan keluar jalur (pin 34 = input-only, cocok IR)

// ─────────────────────────────────────────────────────
// THRESHOLD REAL-TIME — jalur 25cm (sama dengan Master)
//   < 8cm  → LANCAR
//   8–18cm → PADAT
//   > 18cm → MACET
//   ≥ 24cm → paksa LANCAR (ujung jalur / timeout)
// ─────────────────────────────────────────────────────
#define RT_PADAT_CM    8.0f
#define RT_MACET_CM   18.0f
#define RT_MAX_CM     24.0f

#define IR_DEBOUNCE_MS  300UL

// =====================================
// VARIABEL SENSOR B — JALUR TIMUR
// jumlahMasukB : total kendaraan masuk antrian (IR_MASUK_B / BELAKANG)
// sudahLewatB  : total kendaraan keluar jalur  (IR_KELUAR_B / DEPAN)
// sisaB        : masukB - lewatB = estimasi kendaraan masih di jalur
// =====================================
int    jumlahMasukB = 0;
int    sudahLewatB  = 0;
int    sisaB        = 0;
bool   stabilB      = false;
String statusB      = "LANCAR";
float  jarakB       = 0.0f;
unsigned long startMacetB       = 0;
unsigned long lastIRMasukTrigB  = 0;
unsigned long lastIRKeluarTrigB = 0;
bool lastIRMasukB  = HIGH;
bool lastIRKeluarB = HIGH;

// =====================================
// VARIABEL SENSOR C — JALUR SELATAN
// jumlahMasukC : total kendaraan masuk antrian (IR_MASUK_C / BELAKANG)
// sudahLewatC  : total kendaraan keluar jalur  (IR_KELUAR_C / DEPAN)
// sisaC        : masukC - lewatC = estimasi kendaraan masih di jalur
// =====================================
int    jumlahMasukC = 0;
int    sudahLewatC  = 0;
int    sisaC        = 0;
bool   stabilC      = false;
String statusC      = "LANCAR";
float  jarakC       = 0.0f;
unsigned long startMacetC       = 0;
unsigned long lastIRMasukTrigC  = 0;
unsigned long lastIRKeluarTrigC = 0;
bool lastIRMasukC  = HIGH;
bool lastIRKeluarC = HIGH;

// =====================================
// TIMER KIRIM
// =====================================
unsigned long lastKirim = 0;
#define INTERVAL_KIRIM 500UL

// =====================================
// FORWARD DECLARATION
// =====================================
void  setLEDB(String warna);
void  setLEDC(String warna);
void  hubungWifi();
void  hubungServer();
void  cekKoneksi();
void  sensorB();
void  sensorC();
void  kirimData();
void  bacaCommand();
float ultrasonik(int trig, int echo);

// =====================================
// SETUP
// =====================================
void setup() {
  Serial.begin(115200);

  pinMode(LEDB_MERAH,  OUTPUT); pinMode(LEDB_KUNING, OUTPUT); pinMode(LEDB_HIJAU,  OUTPUT);
  pinMode(LEDC_MERAH,  OUTPUT); pinMode(LEDC_KUNING, OUTPUT); pinMode(LEDC_HIJAU,  OUTPUT);
  pinMode(TRIGB_PIN,   OUTPUT); pinMode(ECHOB_PIN,   INPUT);
  pinMode(TRIGC_PIN,   OUTPUT); pinMode(ECHOC_PIN,   INPUT);
  pinMode(IR_MASUK_B,  INPUT);  pinMode(IR_KELUAR_B, INPUT);
  pinMode(IR_MASUK_C,  INPUT);  pinMode(IR_KELUAR_C, INPUT);

  setLEDB("MERAH");
  setLEDC("MERAH");
  hubungWifi();

  Serial.println("======================================");
  Serial.println("  SLAVE SMARTRAF SIAP  (2 IR per jalur)");
  Serial.print  ("  IP: "); Serial.println(WiFi.localIP());
  Serial.println("  Layout: [Lampu/DEPAN]-[IR Keluar/DEPAN]-kend-[IR Masuk/BELAKANG]-[Ultrasonik]");
  Serial.println("  IR DEPAN    = IR Keluar = hitung kendaraan KELUAR jalur");
  Serial.println("  IR BELAKANG = IR Masuk  = hitung kendaraan MASUK jalur");
  Serial.println("  B=timur | C=selatan");
  Serial.println("  <8cm=LANCAR | 8-18cm=PADAT | >18cm=MACET | >=24cm=KOSONG");
  Serial.println("======================================");
}

// =====================================
// KONEKSI
// =====================================
void hubungWifi() {
  Serial.print("[WiFi] Menghubungkan..."); WiFi.begin(ssid, password);
  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - t > 15000) { WiFi.begin(ssid, password); t = millis(); }
    delay(500); Serial.print(".");
  }
  Serial.println("\n[WiFi] " + WiFi.localIP().toString());
  hubungServer();
}

void hubungServer() {
  Serial.print("[TCP] Menghubungkan ke Master...");
  while (!client.connect(serverIP, serverPort)) { Serial.print("."); delay(1000); }
  Serial.println("\n[TCP] Terhubung ke Master!");
}

void cekKoneksi() {
  if (WiFi.status() != WL_CONNECTED) { Serial.println("[WiFi] Reconnect..."); hubungWifi(); return; }
  if (!client || !client.connected()) {
    Serial.println("[TCP] Master terputus! Reconnect...");
    client.stop(); delay(500); hubungServer();
  }
}

// =====================================================
// ULTRASONIK
// =====================================================
float ultrasonik(int trig, int echo) {
  digitalWrite(trig, LOW);  delayMicroseconds(2);
  digitalWrite(trig, HIGH); delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long dur = pulseIn(echo, HIGH, 30000);
  if (dur == 0) return 25.0f;   // timeout = anggap ujung jalur
  return dur * 0.034f / 2.0f;
}

// =====================================================
// SENSOR B — 2 IR
//
// Layout fisik jalur TIMUR:
//   [Lampu/DEPAN] --[IR_KELUAR_B]-- kendaraan --[IR_MASUK_B]-- [Ujung/BELAKANG]
//
//   IR_MASUK_B  (BELAKANG) → jumlahMasukB++ : kendaraan masuk antrian dari belakang
//   IR_KELUAR_B (DEPAN)    → sudahLewatB++  : kendaraan keluar jalur melewati lampu
//   sisaB = jumlahMasukB - sudahLewatB
// =====================================================
void sensorB() {
  // ── IR MASUK — BELAKANG JALUR (kendaraan datang masuk antrian) ──────────────
  bool irMasuk = digitalRead(IR_MASUK_B);
  if (irMasuk == LOW && lastIRMasukB == HIGH &&
      millis() - lastIRMasukTrigB > IR_DEBOUNCE_MS) {
    jumlahMasukB++;
    sisaB = jumlahMasukB - sudahLewatB;
    if (sisaB < 0) sisaB = 0;
    lastIRMasukTrigB = millis();
    Serial.printf("[IR-MASUK-B] masuk=%d lewat=%d sisa=%d\n",
                  jumlahMasukB, sudahLewatB, sisaB);
  }
  lastIRMasukB = irMasuk;

  // ── IR KELUAR — DEPAN JALUR (kendaraan keluar melewati lampu) ───────────────
  bool irKeluar = digitalRead(IR_KELUAR_B);
  if (irKeluar == LOW && lastIRKeluarB == HIGH &&
      millis() - lastIRKeluarTrigB > IR_DEBOUNCE_MS) {
    sudahLewatB++;
    sisaB = jumlahMasukB - sudahLewatB;
    if (sisaB < 0) sisaB = 0;
    lastIRKeluarTrigB = millis();
    Serial.printf("[IR-KELUAR-B] masuk=%d lewat=%d sisa=%d\n",
                  jumlahMasukB, sudahLewatB, sisaB);
  }
  lastIRKeluarB = irKeluar;

  // ── ULTRASONIK ──────────────────────────────────
  jarakB = ultrasonik(TRIGB_PIN, ECHOB_PIN);

  if (jarakB >= RT_MAX_CM) {
    statusB = "LANCAR"; stabilB = false; startMacetB = 0;
  }
  else if (jarakB < RT_PADAT_CM) {
    statusB = "LANCAR"; stabilB = false; startMacetB = 0;
  }
  else if (jarakB < RT_MACET_CM) {
    statusB = "PADAT"; stabilB = false; startMacetB = 0;
  }
  else {
    if (startMacetB == 0) startMacetB = millis();
    if (millis() - startMacetB >= 5000) { stabilB = true; statusB = "MACET"; }
    else statusB = "PADAT";
  }

  // Debug tiap 1 detik
  static unsigned long lastDebugB = 0;
  if (millis() - lastDebugB > 1000) {
    Serial.printf("[B] %.1fcm | %s | masuk=%d lewat=%d sisa=%d\n",
      jarakB, statusB.c_str(), jumlahMasukB, sudahLewatB, sisaB);
    lastDebugB = millis();
  }
}

// =====================================================
// SENSOR C — 2 IR
//
// Layout fisik jalur SELATAN:
//   [Lampu/DEPAN] --[IR_KELUAR_C]-- kendaraan --[IR_MASUK_C]-- [Ujung/BELAKANG]
//
//   IR_MASUK_C  (BELAKANG) → jumlahMasukC++ : kendaraan masuk antrian dari belakang
//   IR_KELUAR_C (DEPAN)    → sudahLewatC++  : kendaraan keluar jalur melewati lampu
//   sisaC = jumlahMasukC - sudahLewatC
// =====================================================
void sensorC() {
  // ── IR MASUK — BELAKANG JALUR (kendaraan datang masuk antrian) ──────────────
  bool irMasuk = digitalRead(IR_MASUK_C);
  if (irMasuk == LOW && lastIRMasukC == HIGH &&
      millis() - lastIRMasukTrigC > IR_DEBOUNCE_MS) {
    jumlahMasukC++;
    sisaC = jumlahMasukC - sudahLewatC;
    if (sisaC < 0) sisaC = 0;
    lastIRMasukTrigC = millis();
    Serial.printf("[IR-MASUK-C] masuk=%d lewat=%d sisa=%d\n",
                  jumlahMasukC, sudahLewatC, sisaC);
  }
  lastIRMasukC = irMasuk;

  // ── IR KELUAR — DEPAN JALUR (kendaraan keluar melewati lampu) ───────────────
  bool irKeluar = digitalRead(IR_KELUAR_C);
  if (irKeluar == LOW && lastIRKeluarC == HIGH &&
      millis() - lastIRKeluarTrigC > IR_DEBOUNCE_MS) {
    sudahLewatC++;
    sisaC = jumlahMasukC - sudahLewatC;
    if (sisaC < 0) sisaC = 0;
    lastIRKeluarTrigC = millis();
    Serial.printf("[IR-KELUAR-C] masuk=%d lewat=%d sisa=%d\n",
                  jumlahMasukC, sudahLewatC, sisaC);
  }
  lastIRKeluarC = irKeluar;

  jarakC = ultrasonik(TRIGC_PIN, ECHOC_PIN);

  if (jarakC >= RT_MAX_CM) {
    statusC = "LANCAR"; stabilC = false; startMacetC = 0;
  }
  else if (jarakC < RT_PADAT_CM) {
    statusC = "LANCAR"; stabilC = false; startMacetC = 0;
  }
  else if (jarakC < RT_MACET_CM) {
    statusC = "PADAT"; stabilC = false; startMacetC = 0;
  }
  else {
    if (startMacetC == 0) startMacetC = millis();
    if (millis() - startMacetC >= 5000) { stabilC = true; statusC = "MACET"; }
    else statusC = "PADAT";
  }

  static unsigned long lastDebugC = 0;
  if (millis() - lastDebugC > 1000) {
    Serial.printf("[C] %.1fcm | %s | masuk=%d lewat=%d sisa=%d\n",
      jarakC, statusC.c_str(), jumlahMasukC, sudahLewatC, sisaC);
    lastDebugC = millis();
  }
}

// =====================================================
// KIRIM DATA KE MASTER
//
// FORMAT (2 IR):
//   B:masuk:lewat:sisa:stabil:status:jarak|C:masuk:lewat:sisa:stabil:status:jarak
//
// Contoh:
//   B:5:3:2:0:PADAT:12.5|C:2:2:0:0:LANCAR:24.0
// =====================================================
void kirimData() {
  if (!client || !client.connected()) return;

  String data =
    "B:" + String(jumlahMasukB) +
    ":"  + String(sudahLewatB)  +
    ":"  + String(sisaB)        +
    ":"  + String((int)stabilB) +
    ":"  + statusB              +
    ":"  + String(jarakB, 1)    +
    "|C:" + String(jumlahMasukC) +
    ":"   + String(sudahLewatC)  +
    ":"   + String(sisaC)        +
    ":"   + String((int)stabilC) +
    ":"   + statusC              +
    ":"   + String(jarakC, 1);

  client.println(data);
  Serial.println("[KIRIM] " + data);
}

// =====================================
// LED B & C
// Saat HIJAU: reset sudahLewat (sesi baru)
//             jumlahMasuk TIDAK direset (statistik harian)
// =====================================
void setLEDB(String warna) {
  digitalWrite(LEDB_MERAH,  warna == "MERAH");
  digitalWrite(LEDB_KUNING, warna == "KUNING");
  digitalWrite(LEDB_HIJAU,  warna == "HIJAU");
  // jumlahMasuk dan sudahLewat adalah akumulasi harian — TIDAK direset per siklus
  // sisaB = jumlahMasukB - sudahLewatB dihitung real-time dari kedua IR sensor
  Serial.println("[LED-B] " + warna);
}

void setLEDC(String warna) {
  digitalWrite(LEDC_MERAH,  warna == "MERAH");
  digitalWrite(LEDC_KUNING, warna == "KUNING");
  digitalWrite(LEDC_HIJAU,  warna == "HIJAU");
  // jumlahMasuk dan sudahLewat adalah akumulasi harian — TIDAK direset per siklus
  // sisaC = jumlahMasukC - sudahLewatC dihitung real-time dari kedua IR sensor
  Serial.println("[LED-C] " + warna);
}

// =====================================
// BACA COMMAND DARI MASTER
// FORMAT: CMD:B:HIJAU atau CMD:C:MERAH
// =====================================
void bacaCommand() {
  if (!client || !client.connected()) return;
  while (client.available()) {
    String cmd = client.readStringUntil('\n');
    cmd.trim(); if (cmd.length() == 0) continue;
    if (cmd.startsWith("CMD:")) {
      int p = cmd.indexOf(':', 4);
      if (p != -1) {
        String jalur = cmd.substring(4, p);
        String aksi  = cmd.substring(p + 1);
        if (jalur == "B") setLEDB(aksi);
        if (jalur == "C") setLEDC(aksi);
      }
    }
  }
}

// =====================================
// LOOP
// =====================================
void loop() {
  cekKoneksi();
  sensorB();
  sensorC();

  unsigned long sekarang = millis();
  if (sekarang - lastKirim >= INTERVAL_KIRIM) {
    kirimData();
    lastKirim = sekarang;
  }
  bacaCommand();
}