/*
 Cool arduino script
 Not sure what to really say right now I'll figure out what to say here later
*/

#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>

#define LIDAR_RECIEVE A1
#define LIDAR_TRANSMIT A2
#define LIGHT_VAL A0

char networkName[] = "AndroidAP1AF7"; // name of the network
char password[] = "oelk5711"; // password into the network - we may need username too later
char server[] = ""; // the server address
int port = 80; // the port to the server

WiFiClient client; // the wifi client object

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(LIGHT_VAL, INPUT);
  pinMode(LIDAR_RECIEVE, INPUT);
  pinMode(LIDAR_TRANSMIT, INPUT);

  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial); // wait for serial connection

  // now for wifi shenanigans
  if (WiFi.status() == WL_NO_MODULE) {
    while (true) {
      digitalWrite(LED_BUILTIN, HIGH);
      delay(1);
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("Can't connect to the WiFi Module (something has gone HORRIBLY WRONG)");
      delay(1);
    }
  }

  // connecting time
  while (WiFi.begin(networkName, password) != WL_CONNECTED) {
    Serial.print("Connecting to: ");
    Serial.println(networkName);
    delay(10000);
  }

  Serial.println("Connected to WiFi success!");
  printWifiStatus();
}

void loop() {
  // put your main code here, to run repeatedly:
  // todo: sensor data

  int read1 = analogRead(LIDAR_TRANSMIT);
  int read = analogRead(LIDAR_RECIEVE);
  Serial.print("LIDAR: ");
  Serial.print(read);
  Serial.print(" ");
  Serial.println(read1);
}

// print the status of the wifi connection
void printWifiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  long rssi = WiFi.RSSI();
  Serial.print("Signal Strength (RSSI): ");
  Serial.print(rssi);
  Serial.println(" dBm");
}

// Make a server request
void httpRequest(String lightVal, String lidarVal) {
  HttpClient httpClient = HttpClient(client, server, port);
  String postData = "param1=" + lightVal + "&param2=" + lidarVal;

  String path = "/databasepath/";

  httpClient.beginRequest();
  httpClient.post(path);
  httpClient.sendHeader("Content-Type", "application/x-www-form-urlencoded"); // application/json
  httpClient.sendHeader("Content-Length", postData.length());
  httpClient.endRequest();
  httpClient.write((byte*) postData.c_str(), postData.length());

  int statusCode = httpClient.responseStatusCode();
  String response = httpClient.responseBody();

  Serial.print("Status: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  httpClient.stop();
}
