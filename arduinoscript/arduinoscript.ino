/*
 Cool arduino script
 Not sure what to really say right now I'll figure out what to say here later
*/

#include <SPI.h>
#include <WiFiNINA.h>

char networkName[] = ""; // name of the network
char password[] = ""; // password into the network - we may need username too later
char server[] = ""; // the server address
int port = 80; // the port to the server

WiFiClient client; // the wifi client object

unsigned long lastConnectionTime = 0;
const unsigned long postInterval = 10000;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);

  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial); // wait for serial connection

  // now for wifi shenanigans
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Can't connect to the WiFi Module (something has gone HORRIBLY WRONG)");
    while (true) {
      digitalWrite(LED_BUILTIN, HIGH);
      delay(1);
      digitalWrite(LED_BUILTIN, LOW);
      delay(1);
    }
  }

  // connecting time
  while (status != WL_CONNECTED) {
    Serial.print("Connecting to: ");
    Serial.println(networkName);
    // this will be interesting to try and connect to eduroam
    status = WiFi.begin(networkName, password);
    delay(10000);
  }

  Serial.println("Connected to WiFi success!");
  printWifiStatus();
}

void loop() {
  // put your main code here, to run repeatedly:

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
void httpRequest() {
  client.stop();

  if (client.connect(server, port)) {
    Serial.println("Sending request...");
    client.println("POST / HTTP/1.1");
    client.println("User-Agent: ArduinoWiFi/1.1");
    client.println("Access-Allow-Cross-Origin: allow");
    client.println("Connection: close");
    // TODO: add the body of the post request
    client.println();
    lastConnectionTime = millis();
  }
  else {
    // blink the LED a bit to let us know something is wrong
    Serial.println("Connection to server failed!");
    for (int i = 0; i < 10; i++) {
      digitalWrite(LED_BUILTIN, HIGH);
      delay(1);
      digitalWrite(LED_BUILTIN, LOW);
      delay(1);
    }
  }
}
