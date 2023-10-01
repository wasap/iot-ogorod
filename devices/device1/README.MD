docs https://github.com/GoogleCloudPlatform/google-cloud-iot-arduino

download arduino ide https://www.arduino.cc/en/software
add to preferences -> additiional board http://arduino.esp8266.com/stable/package_esp8266com_index.json
select wemos d1 r1

use speed 115200 in logs and upload
if device not seen
sudo apt remove brltty 
sudo chown username /dev/ttyUSB0