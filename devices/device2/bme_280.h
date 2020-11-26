#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define BME_ADDR 0x76

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme; // I2C


String printBME280() {
//    Serial.print("Temperature = ");
//    Serial.print(bme.readTemperature());
//    Serial.println(" *C");
//
//    Serial.print("Pressure = ");
//
//    Serial.print(bme.readPressure() / 100.0F * 0.75006);
//    Serial.println(" mmhg");
//
//    Serial.print("Approx. Altitude = ");
//    Serial.print(bme.readAltitude(SEALEVELPRESSURE_HPA));
//    Serial.println(" m");
//
//    Serial.print("Humidity = ");
//    Serial.print(bme.readHumidity());
//    Serial.println(" %");

    
    return "["+String(bme.readTemperature())+"," + String(bme.readPressure() / 100.0F * 0.75006)+","+String(bme.readHumidity())+"]";
    
}
