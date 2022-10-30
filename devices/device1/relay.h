

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
  digitalWrite(PIN_D6, state ? LOW : HIGH);
//  if(state){
//    digitalWrite(PIN_D6, LOW);
//    delay(15000);
////    _blinkPlate(2);
//    digitalWrite(PIN_D6, HIGH);
//  } else {
//    digitalWrite(PIN_D5, LOW);
//    delay(15000);
//    digitalWrite(PIN_D5, HIGH);
////    _blinkPlate(3);
//  }
}

void callRelay(bool isOn, int disableSecs){
  _blinkPlate(1);
  
     _setRelay(isOn);
    if(isOn){
      if(disableSecs > 0){
        delay(disableSecs * 1000);
        _setRelay(false);
      }
    }
  
}
