#include <Arduino.h>
#include <WiFi.h>

// =====================================
// KONFIGURASI WIFI
// =====================================
const char* ssid     = "Mbarep";
const char* password = "mivavihada";

IPAddress serverIP(192, 168, 1, 1);   // ← GANTI dengan IP Master saat runtime
const int  serverPort = 8080;

WiFiClient client;

// =====================================
// PIN LED & SENSOR B
// =====================================
#define LEDB_MERAH  16
#define LEDB_KUNING 17
#define LEDB_HIJAU  18
#define TRIGB_PIN   14
#define ECHOB_PIN   27
#define IRB_PIN     26

// =====================================
// PIN LED & SENSOR C
// =====================================
#define LEDC_MERAH  23
#define LEDC_KUNING 25
#define LEDC_HIJAU  32
#define TRIGC_PIN   19
#define ECHOC_PIN   21
#define IRC_PIN     22

// ─────────────────────────────────────────────────────
// THRESHOLD REAL-TIME (sama dengan Master)
// ─────────────────────────────────────────────────────
#define RT_PADAT_CM   5.0f
#define RT_MACET_CM  15.0f
#define RT_MAX_CM    20.0f   // FIX: di atas ini = kosong = LANCAR

// ─────────────────────────────────────────────────────
// DEBOUNCE IR
// ─────────────────────────────────────────────────────
#define IR_DEBOUNCE_MS  300UL

// =====================================
// VARIABEL SENSOR B
// =====================================
int    jumlahB     = 0;
bool   stabilB     = false;
String statusB     = "LANCAR";
float  jarakB      = 0.0f;
unsigned long startMacetB    = 0;
unsigned long lastIRTriggerB = 0;
bool lastIRB = HIGH;

// =====================================
// VARIABEL SENSOR C
// =====================================
int    jumlahC     = 0;
bool   stabilC     = false;
String statusC     = "LANCAR";
float  jarakC      = 0.0f;
unsigned long startMacetC    = 0;
unsigned long lastIRTriggerC = 0;
bool lastIRC = HIGH;

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
  pinMode(TRIGB_PIN,   OUTPUT); pinMode(ECHOB_PIN,   INPUT);  pinMode(IRB_PIN,     INPUT);
  pinMode(TRIGC_PIN,   OUTPUT); pinMode(ECHOC_PIN,   INPUT);  pinMode(IRC_PIN,     INPUT);

  setLEDB("MERAH");
  setLEDC("MERAH");
  hubungWifi();

  Serial.println("==============================");
  Serial.println("  SLAVE SMARTRAF SIAP");
  Serial.print  ("  IP: "); Serial.println(WiFi.localIP());
  Serial.println("  B=timur | C=selatan");
  Serial.println("  <5cm=LANCAR | 5-15cm=PADAT | >15cm=MACET");
  Serial.println("==============================");
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
// ULTRASONIK GENERIK
//
// FIX: return 400.0f saat timeout agar sistem tahu kosong.
// HC-SR04 secara alami membaca kendaraan terdekat
// karena gelombang pertama kali dipantulkan oleh
// objek yang paling dekat.
// =====================================================
float ultrasonik(int trig, int echo) {
  digitalWrite(trig, LOW);  delayMicroseconds(2);
  digitalWrite(trig, HIGH); delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long dur = pulseIn(echo, HIGH, 30000);

  if (dur == 0) return 25.0f;   // timeout = tidak ada kendaraan

  return dur * 0.034f / 2.0f;
}

// =====================================================
// SENSOR B
//
// FIX 1: lastIRTriggerB diupdate saat trigger
// FIX 2: jarak > RT_MAX_CM dianggap kosong = LANCAR
// =====================================================
void sensorB() {
  bool irState = digitalRead(IRB_PIN);

  if (irState == LOW && lastIRB == HIGH &&
      millis() - lastIRTriggerB > IR_DEBOUNCE_MS) {
    jumlahB++;
    lastIRTriggerB = millis();   // FIX: update debounce
    Serial.printf("[IR-B] Kendaraan masuk, total=%d\n", jumlahB);
  }
  lastIRB = irState;

  jarakB = ultrasonik(TRIGB_PIN, ECHOB_PIN);

  // FIX: > RT_MAX_CM (20cm) = kosong = paksa LANCAR
  if (jarakB > RT_MAX_CM) {
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

  // nambah debug di sini
  static unsigned long lastDebugB = 0;

  if (millis() - lastDebugB > 1000) {
    Serial.printf("[B] jarak=%.1f cm |status=%s | jumlah=%d\n",
        jarakB,
        statusB.c_str(),
        jumlahB);
    lastDebugB = millis();
  }
}

// =====================================================
// SENSOR C (sama dengan B)
// =====================================================
void sensorC() {
  bool irState = digitalRead(IRC_PIN);

  if (irState == LOW && lastIRC == HIGH &&
      millis() - lastIRTriggerC > IR_DEBOUNCE_MS) {
    jumlahC++;
    lastIRTriggerC = millis();   // FIX: update debounce
    Serial.printf("[IR-C] Kendaraan masuk, total=%d\n", jumlahC);
  }
  lastIRC = irState;

  jarakC = ultrasonik(TRIGC_PIN, ECHOC_PIN);

  if (jarakC > RT_MAX_CM) {
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

  // nambah di sini
  static unsigned long lastDebugC = 0;

  if (millis() - lastDebugC > 1000) {
    Serial.printf("[C] jarak=%.1f cm | status=%s | jumlah=%d\n",
          jarakC,
          statusC.c_str(),
          jumlahC);
    lastDebugC = millis();
  }
}

// =====================================================
// KIRIM DATA KE MASTER
// FORMAT: B:jumlah:stabil:status:jarak|C:jumlah:stabil:status:jarak
// =====================================================
void kirimData() {
  if (!client || !client.connected()) return;
  String data =
    "B:" + String(jumlahB) + ":" + String((int)stabilB) + ":" + statusB + ":" + String(jarakB, 1) +
    "|C:" + String(jumlahC) + ":" + String((int)stabilC) + ":" + statusC + ":" + String(jarakC, 1);
  client.println(data);

  Serial.println("[KIRIM]" + data);
}

// =====================================
// LED B & C
// =====================================
void setLEDB(String warna) {
  digitalWrite(LEDB_MERAH,  warna == "MERAH");
  digitalWrite(LEDB_KUNING, warna == "KUNING");
  digitalWrite(LEDB_HIJAU,  warna == "HIJAU");
  if (warna == "HIJAU") jumlahB = 0;
  Serial.println("[LED-B] " + warna);
}

void setLEDC(String warna) {
  digitalWrite(LEDC_MERAH,  warna == "MERAH");
  digitalWrite(LEDC_KUNING, warna == "KUNING");
  digitalWrite(LEDC_HIJAU,  warna == "HIJAU");
  if (warna == "HIJAU") jumlahC = 0;
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