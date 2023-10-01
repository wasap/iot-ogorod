/******************************************************************************
 * Copyright 2018 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****************************************************************************/
// This file contains static methods for API requests using Wifi / MQTT

#include <ESP8266WiFi.h>
#include "FS.h"

// You need to set certificates to All SSL cyphers and you may need to
// increase memory settings in Arduino/cores/esp8266/StackThunk.cpp:
//   https://github.com/esp8266/Arduino/issues/6811

#include "WiFiClientSecure.h"
#include <ESP8266HTTPClient.h>
#include <time.h>


#include "ciotc_config.h" // Wifi configuration here

#include "relay.h"
#include "bme_280.h"
//#include <future> 



// Initialize WiFi and MQTT for this board

unsigned long iat = 0;
String jwt;

///////////////////////////////
// Helpers specific to this board
///////////////////////////////
String getDefaultSensor()
{
  return "Wifi: " + String(WiFi.RSSI()) + "db";
}

void setupWifi()
{
  int retryNum = 0;
  WiFi.mode(WIFI_STA);
  
  
  while (WiFi.status() != WL_CONNECTED)
  {
    if(retryNum < 80){
      Serial.println("Connecting to WiFi1");
      Serial.println(ssid);
      if(retryNum == 0)
      WiFi.begin(ssid, password);
      retryNum += 1;
      if(retryNum == 80) retryNum = 160;
    } else {
      Serial.println("Connecting to WiFi2");
      Serial.println(ssid2);
      if(retryNum == 160)
      WiFi.begin(ssid2, password2);
      retryNum -= 1;
      if(retryNum == 80) retryNum = 0;
    }
    delay(100);
  }

  configTime(0, 0, ntp_primary, ntp_secondary);
  Serial.println("Waiting on time sync...");
  while (time(nullptr) < 1510644967)
  {
    delay(10);
  }
}


void publishTelemetry(String data)
{
  Serial.println(data);
  HTTPClient http;
  WiFiClientSecure client;
  client.setInsecure();
  http.begin(client, telemetryUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("token", token);
  int httpResponseCode = http.POST(data);
  String payload = http.getString(); 
   
  if (httpResponseCode>0) {
    Serial.println("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else {
    Serial.println("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();
}


