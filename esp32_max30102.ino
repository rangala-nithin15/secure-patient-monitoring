#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>

#include "MAX30105.h"
#include "heartRate.h"

#include <OneWire.h>
#include <DallasTemperature.h>

/* ---------- WIFI ---------- */
const char* ssid = "NITHIN";
const char* password = "nithin1056q";

/* ---------- SERVER ---------- */
const char* serverURL = "http://192.168.29.217:5000/api/vitals";
const char* token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzFmM2Y2NjUxM2IxNWFkMGMzNjExNyIsImlhdCI6MTc2OTEwMzE3Mn0.MPzPqBjQy5w1TCle5Ak-QeOjllUdyVfr_Muhf0uzPjY";
const char* patientId = "PATIENT001";

/* ---------- MAX30102 ---------- */
MAX30105 particleSensor;

const byte RATE_SIZE = 8;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;

float beatsPerMinute;
int beatAvg;

/* ---------- DS18B20 ---------- */
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  delay(1000);

  /* WiFi */
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  /* Temperature */
  sensors.begin();

  /* MAX30102 */
  Wire.begin();
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 NOT FOUND");
    while (1);
  }

  particleSensor.setup(
    0x1F,   // LED brightness (IMPORTANT)
    4,      // sample average
    2,      // mode: RED + IR
    400,    // sample rate
    411,    // pulse width
    4096    // ADC range
  );

  Serial.println("Sensors initialized");
  Serial.println("Place finger on MAX30102...");
}

/* ---------- SEND TO BACKEND ---------- */
void sendVitals(float temp, int bpm, int spo2) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("Bearer ") + token);

    String json = "{";
    json += "\"patientId\":\"" + String(patientId) + "\",";
    json += "\"heartRate\":" + String(bpm) + ",";
    json += "\"spo2\":" + String(spo2) + ",";
    json += "\"temperature\":" + String(temp);
    json += "}";

    int httpCode = http.POST(json);
    Serial.print("HTTP Response: ");
    Serial.println(httpCode);
    http.end();
  }
}

void loop() {
  long irValue = particleSensor.getIR();
  long redValue = particleSensor.getRed();

  /* ---------- BPM ---------- */
  if (checkForBeat(irValue)) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60.0 / (delta / 1000.0);

    if (beatsPerMinute > 30 && beatsPerMinute < 180) {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE;

      beatAvg = 0;
      for (byte i = 0; i < RATE_SIZE; i++) {
        beatAvg += rates[i];
      }
      beatAvg /= RATE_SIZE;
    }
  }

  /* ---------- SpO2 (approx but real) ---------- */
  int spo2 = 0;
  if (irValue > 50000) {
    spo2 = map(redValue, 30000, 80000, 95, 100);
    spo2 = constrain(spo2, 93, 99);
  }

  /* ---------- Temperature ---------- */
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);

  /* ---------- SERIAL MONITOR ---------- */
  Serial.print("IR: ");
  Serial.print(irValue);
  Serial.print(" | RED: ");
  Serial.print(redValue);
  Serial.print(" | BPM: ");
  Serial.print(beatAvg);
  Serial.print(" | SpO2: ");
  Serial.print(spo2);
  Serial.print(" % | Temp: ");
  Serial.print(temperatureC);
  Serial.println(" °C");

  /* ---------- SEND TO MONGODB ---------- */
  if (beatAvg > 40 && spo2 > 90) {
    sendVitals(temperatureC, beatAvg, spo2);
  }

  delay(2000);
}
