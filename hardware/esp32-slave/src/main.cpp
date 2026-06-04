#include <Arduino.h>
#include <WiFi.h>

// =====================================
// WIFI CLIENT
// =====================================
const char* ssid     = "Polinema Hotspot 2";
const char* password = "polinemajoss";

IPAddress serverIP(192, 168, 1, 1);
const int serverPort = 8080;

WiFiClient client;

// =====================================
// PIN SENSOR & LED B
// =====================================
#define LEDB_MERAH  16
#define LEDB_KUNING 17
#define LEDB_HIJAU  18
#define TRIGB_PIN   14
#define ECHOB_PIN   27
#define IRB_PIN     26

// =====================================
// PIN SENSOR & LED C
// =====================================
#define LEDC_MERAH  23
#define LEDC_KUNING 25
#define LEDC_HIJAU  32
#define TRIGC_PIN   19
#define ECHOC_PIN   21
#define IRC_PIN     22

// =====================================
// THRESHOLD REAL-TIME (kepadatan aktif saat lampu berjalan)
// =====================================
#define RT_PADAT_CM    50.0f
#define RT_MACET_CM   150.0f

// =====================================
// VARIABEL SENSOR
// =====================================
int    jumlahB = 0;
int    jumlahC = 0;
bool   stabilB = false;
bool   stabilC = false;
String statusB = "LANCAR";
String statusC = "LANCAR";
float  jarakB  = 0;
float  jarakC  = 0;

unsigned long startMacetB = 0;
unsigned long startMacetC = 0;

bool lastIRB = HIGH;
bool lastIRC = HIGH;

// =====================================
// TIMER KIRIM DATA
// =====================================
unsigned long lastKirim = 0;
#define INTERVAL_KIRIM 500UL  // kirim data tiap 500ms

// =====================================
// FORWARD DECLARATION
// =====================================
void setLEDB(String warna);
void setLEDC(String warna);
void hubungWifi();
void hubungServer();
void cekKoneksi();
void sensorB();
void sensorC();
void kirimData();
void bacaCommand();
float ultrasonik(int trig, int echo);

// =====================================
// SETUP
// =====================================
void setup() {
  Serial.begin(115200);

  // LED B
  pinMode(LEDB_MERAH,  OUTPUT);
  pinMode(LEDB_KUNING, OUTPUT);
  pinMode(LEDB_HIJAU,  OUTPUT);
  // LED C
  pinMode(LEDC_MERAH,  OUTPUT);
  pinMode(LEDC_KUNING, OUTPUT);
  pinMode(LEDC_HIJAU,  OUTPUT);

  // Sensor B
  pinMode(TRIGB_PIN, OUTPUT);
  pinMode(ECHOB_PIN, INPUT);
  pinMode(IRB_PIN,   INPUT);
  // Sensor C
  pinMode(TRIGC_PIN, OUTPUT);
  pinMode(ECHOC_PIN, INPUT);
  pinMode(IRC_PIN,   INPUT);

  // Semua merah saat start
  setLEDB("MERAH");
  setLEDC("MERAH");

  // Koneksi WiFi
  hubungWifi();

  Serial.println("==============================");
  Serial.println("  JALUR B dan C SMARTRAF SIAP");
  Serial.print  ("  IP: "); Serial.println(WiFi.localIP());
  Serial.println("  Jalur B = timur");
  Serial.println("  Jalur C = selatan");
  Serial.println("==============================");
}

// =====================================
// HUBUNG WIFI & SERVER
// =====================================
void hubungWifi() {
  Serial.print("[WIFI] Menghubungkan ke ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - t > 15000) {
      Serial.println("[WIFI] Timeout, coba lagi...");
      WiFi.begin(ssid, password);
      t = millis();
    }
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WIFI] " + WiFi.localIP().toString() + " Terhubung!");
  hubungServer();
}

// =====================================================
// KONEKSI KE MASTER
// =====================================================
void hubungServer() {
  Serial.print("[SERVER] Menghubungkan ke Master...");
  while (!client.connect(serverIP, serverPort)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\n[SERVER] Terhubung ke Master!");
}

// =====================================
// CEK & RECONNECT KONEKSI
// =====================================
void cekKoneksi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WIFI] Terputus! Reconnect...");
    hubungWifi();
    return;
  }

  if (!client || !client.connected()) {
    Serial.println("[SERVER] Koneksi Master terputus! Reconnect...");
    client.stop();
    delay(500);
    hubungServer();
  }
}

// =====================================
// ULTRASONIK
// =====================================
float ultrasonik(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long durasi = pulseIn(echo, HIGH, 30000);
  return durasi * 0.034 / 2;
}

// =====================================
// SENSOR B (non-blocking)
// =====================================
void sensorB() {
  bool irState = digitalRead(IRB_PIN);
  if (irState == LOW && lastIRB == HIGH) {
    jumlahB++;
    Serial.println("[B] Kendaraan masuk");
  }
  lastIRB = irState;

  jarakB = ultrasonik(TRIGB_PIN, ECHOB_PIN);

  if (jarakB < RT_PADAT_CM) {
    // Jarak pendek → tidak ada antrian berarti → LANCAR
    statusB = "LANCAR";
    stabilB = false;
    startMacetB = 0;
  }
  else if (jarakB < RT_MACET_CM) {
    // Jarak sedang → antrian mulai terbentuk → PADAT
    statusB = "PADAT";
    stabilB = false;
    startMacetB = 0;
  }
  else {
    // Jarak jauh → antrian panjang → MACET (tunggu stabil 5 detik)
    if (startMacetB == 0) startMacetB = millis();
    if (millis() - startMacetB >= 5000) { stabilB = true; statusB = "MACET"; }
    else statusB = "PADAT";   // belum stabil, anggap PADAT dulu
  }
}

// =====================================
// SENSOR C (non-blocking)
// =====================================
void sensorC() {
  bool irState = digitalRead(IRC_PIN);
  if (irState == LOW && lastIRC == HIGH) {
    jumlahC++;
    Serial.println("[C] Kendaraan masuk");
  }
  lastIRC = irState;

  jarakC = ultrasonik(TRIGC_PIN, ECHOC_PIN);

  if (jarakC < RT_PADAT_CM) {
    // Jarak pendek → tidak ada antrian berarti → LANCAR
    statusC = "LANCAR";
    stabilC = false;
    startMacetC = 0;
  }
  else if (jarakC < RT_MACET_CM) {
    // Jarak sedang → antrian mulai terbentuk → PADAT
    statusC = "PADAT";
    stabilC = false;
    startMacetC = 0;
  }
  else {
    // Jarak jauh → antrian panjang → MACET (tunggu stabil 5 detik)
    if (startMacetC == 0) startMacetC = millis();
    if (millis() - startMacetC >= 5000) { stabilC = true; statusC = "MACET"; }
    else statusC = "PADAT";   // belum stabil, anggap PADAT dulu
  }
}

// =====================================
// KIRIM DATA KE MASTER
// FORMAT: B:jumlah:stabil:status|C:jumlah:stabil:status
// =====================================
void kirimData() {
  if (!client || !client.connected()) return;

  String data =
    "B:" + String(jumlahB) + ":" + String((int)stabilB) + ":" + statusB + ":" + String(jarakB, 1) +
    "|C:" + String(jumlahC) + ":" + String((int)stabilC) + ":" + statusC + ":" + String(jarakC, 1);

  client.println(data);
}

// =====================================
// LED CONTROL B
// =====================================
void setLEDB(String warna) {
  digitalWrite(LEDB_MERAH,  warna == "MERAH");
  digitalWrite(LEDB_KUNING, warna == "KUNING");
  digitalWrite(LEDB_HIJAU,  warna == "HIJAU");
  if (warna == "HIJAU") jumlahB = 0; // reset saat dapat hijau
  Serial.println("[LED-B timur] " + warna);
}

// =====================================
// LED CONTROL C
// =====================================
void setLEDC(String warna) {
  digitalWrite(LEDC_MERAH,  warna == "MERAH");
  digitalWrite(LEDC_KUNING, warna == "KUNING");
  digitalWrite(LEDC_HIJAU,  warna == "HIJAU");
  if (warna == "HIJAU") jumlahC = 0; // reset saat dapat hijau
  Serial.println("[LED-C selatan] " + warna);
}

// =====================================
// BACA COMMAND DARI MASTER
// FORMAT: CMD:B:HIJAU atau CMD:C:MERAH
// =====================================
void bacaCommand() {
  if (!client || !client.connected()) return;

  while (client.available()) {
    String cmd = client.readStringUntil('\n');
    cmd.trim();
    if (cmd.length() == 0) continue;
    Serial.println("[CMD] " + cmd);
    if (cmd.startsWith("CMD:")) {
      // Cari posisi ':' kedua
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
// LOOP UTAMA
// =====================================
void loop() {
  // Cek koneksi, reconnect jika perlu
  cekKoneksi();
  // Baca sensor
  sensorB();
  sensorC();
  // Kirim data ke master tiap 500ms
  unsigned long sekarang = millis();
  if (sekarang - lastKirim >= INTERVAL_KIRIM) {
    kirimData();
    lastKirim = sekarang;
  }
  // Baca command dari master (non-blocking)
  bacaCommand();
}
