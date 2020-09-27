#include <ArduinoJson.h>

int PIN_D6 = 12;
int PIN_D5 = 14;

void _blinkPlate(int times){
  for(int i = 0; i<times; i++){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100 * times);
    digitalWrite(LED_BUILTIN, LOW);
  }
}

void _setRelay(bool state){
  if(state){
    digitalWrite(PIN_D6, LOW);
    delay(15000);
//    _blinkPlate(2);
    digitalWrite(PIN_D6, HIGH);
  } else {
    digitalWrite(PIN_D5, LOW);
    delay(15000);
    digitalWrite(PIN_D5, HIGH);
//    _blinkPlate(3);
  }
}

void callRelay(String params){
  _blinkPlate(1);
  Serial.println("params: " + params);
  
  StaticJsonDocument<300> doc;
  deserializeJson(doc, params);
  bool isOn = doc["isOn"];
  bool isCommand = doc["isCommand"];
  int disableSecs = doc["disableSecs"];
  if(isCommand){
     _setRelay(isOn);
    if(isOn){
      if(disableSecs > 0){
        delay(disableSecs * 1000);
        _setRelay(false);
      }
    }
  }
}
