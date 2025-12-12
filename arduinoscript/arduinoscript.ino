/*
 Cool arduino script
 Not sure what to really say right now I'll figure out what to say here later
*/
#include <Arduino.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <WiFiNINA.h>
//#include <ArduinoHttpClient.h>
#include <HttpClient.h>

#define LIGHT_VAL A0

char networkName[] = "AndroidAP1AF7"; // name of the network
char password[] = "oelk5711"; // password into the network - we may need username too later
char server[] = "aws-testing-1.onrender.com"; // the server address
int port = 443; // the port to the server

WiFiSSLClient client; // the wifi client object

int lightTimer = 0;
int lastDist = 0;
int distDiff = 0;
int lowDist = 1000, highDist = 0;

const int arduinoID = 0;
const int lidarID = 0;
const int lightID = 1; 

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(LIGHT_VAL, INPUT);

  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial1.begin(115200);
  while (!Serial); // wait for serial connection
  while (!Serial1);

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
  // LIDAR
  if (Serial1.available() % 9 == 0) {
    if (Serial1.read() == 0x59 && Serial1.read() == 0x59) {
      int distLow = Serial1.read();
      int distHigh = Serial1.read();
      int strengthLow = Serial1.read();
      int strengthHigh = Serial1.read();
      int tempLow = Serial1.read();
      int tempHight = Serial1.read();
      int checksum = Serial1.read();

      int dist = distLow + (distHigh * 256);
      // for some reason, LiDAR sensor we're using spits out junk data occassionally
      // the abs call is meant to filter out sudden jumps of possibly meters
      if (dist < 1000 && dist > 3 && abs(lastDist - dist) < 80) {
        Serial.print("Distance: ");
        Serial.print(dist);
        Serial.println(" cm");
        lastDist = dist;

        if (dist < lowDist) {
          lowDist = dist;
        }
        if (dist > highDist) {
          highDist = dist;
        }

        if (lightTimer > 10) {
          int lightVal = digitalRead(LIGHT_VAL);
          Serial.print("Light: ");
          Serial.println(lightVal);
          lightTimer = 0;
          distDiff = highDist - lowDist;
          httpRequest(lightVal, distDiff);
          highDist = 0;
          lowDist = 0;
        }
      }
      
    }
    // else {
    //   Serial.println("LiDAR bugging out!");
    // }
    lightTimer++;
    
    delay(10);
  }
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
void httpRequest(int lightVal, int lidarVal) {
  // HttpClient httpClient = HttpClient(client, server, port);

  // JsonDocument doc;
  // doc["light"] = lightVal;
  // doc["light_id"] = lightID;
  // doc["lidar"] = lidarVal;
  // doc["lidar_id"] = lidarID;
  // doc["arduino_id"] = arduinoID;

  // String requestBody;
  // serializeJson(doc, requestBody);

  // httpClient.beginRequest();
  // httpClient.post("/arduino/");
  // httpClient.sendHeader("Content-Type", "application/json"); // application/json
  // httpClient.sendHeader("Content-Length", String(requestBody.length()));
  // httpClient.endRequest();
  // httpClient.write((byte*) requestBody.c_str(), requestBody.length());

  // int statusCode = httpClient.responseStatusCode();
  // String response = httpClient.responseBody();

  // Serial.print("Status: ");
  // Serial.println(statusCode);
  // Serial.print("Response: ");
  // Serial.println(response);

  // httpClient.stop();

  // 1. Stop any previous connection
  client.stop();

  Serial.println("Starting HTTPS connection...");

  // 2. Connect to the server on port 443 (HTTPS)
  if (client.connect(server, port)) {
    Serial.println("Connected to server!");

    // 3. Build the URL path with Query Parameters
    // Matches req.query.lidar, req.query.light, etc. in index.js
    String url = "/arduino/";
    url += "?lidar=" + String(lidarVal);
    url += "&light=" + String(lightVal);
    url += "&arduino_id=" + String(arduinoID);
    url += "&lidar_id=" + String(lidarID); 

    Serial.print("Requesting URL: ");
    Serial.println(url);

    // 4. Send the HTTP POST headers
    client.print("POST " + url + " HTTP/1.1\r\n");
    client.print("Host: " + String(server) + "\r\n");
    client.print("Connection: close\r\n");
    // We are sending data in the URL (Query Params), so content-length is 0
    client.print("Content-Length: 0\r\n"); 
    client.print("\r\n"); // End of headers

  } else {
    Serial.println("Connection failed!");
    // Common SSL Issue: If this fails, you may need to add the 
    // "aws-testing-1.onrender.com" SSL certificate to your 
    // Arduino board using the 'Firmware Updater' tool in the IDE.
  }
}
