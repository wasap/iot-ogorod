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

#if defined(ARDUINO_SAMD_MKR1000) or defined(ESP32)
#define __SKIP_ESP8266__
#endif

#if defined(ESP8266)
#define __ESP8266_MQTT__
#endif

#ifdef __SKIP_ESP8266__

#include <Arduino.h>

void setup(){
  Serial.begin(115200);
}

void loop(){
  Serial.println("Hello World");
}

#endif

#ifdef __ESP8266_MQTT__
#include <CloudIoTCore.h>

#include "esp8266_mqtt.h"




#ifndef LED_BUILTIN
#define LED_BUILTIN 13
#endif


void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  setupCloudIoT(); // Creates globals for MQTT
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PIN_D6, OUTPUT);
  digitalWrite(PIN_D6, HIGH);
  pinMode(PIN_D5, OUTPUT);
  digitalWrite(PIN_D5, HIGH);
    if (!bme.begin(BME_ADDR)) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
    }
}

unsigned long lastMillis = 0;
void loop()
{
  mqtt->loop();
  delay(10); // <- fixes some issues with WiFi stability

  if (!mqttClient->connected())
  {

    // #ifdef ESP32
    // connect();
    // #endif

    // #ifdef __ESP8266_MQTT_H__
    ESP.wdtDisable();
    connect();
    ESP.wdtEnable(0);
    // #endif
  }

  // TODO: Replace with your code here
 if (millis() - lastMillis > 3600000)
 {
   lastMillis = millis();
   publishTelemetry(printBME280());
 }
}
#endif
