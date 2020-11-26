# PROJECT_ID=PROJECT_ID
# TOPIC=TOPIC
# SUBSCRIPTION=SUBSCRIPTION
# REGISTRY=REGISTRY
# REGION=REGION
# DEVICE=DEVICE

gcloud pubsub topics create ${TOPIC} --project=${PROJECT_ID}
gcloud pubsub subscriptions create ${SUBSCRIPTION} --topic=${TOPIC}

gcloud iot registries create ${REGISTRY} \
  --region=${REGION} --event-notification-config=topic=${TOPIC}



# create registry keys
openssl genpkey -algorithm RSA -out ca_private_registry.pem -pkeyopt rsa_keygen_bits:2048
sudo openssl req -x509 -new -nodes -key ca_private_registry.pem -sha256 -out ca_cert_registry.pem -subj "/CN=unused"
gcloud iot registries credentials create --path=ca_cert_registry.pem  --project=${PROJECT_ID}  --registry=${REGISTRY} --region=${REGION}


# create elipitic device keys
openssl ecparam -genkey -name prime256v1 -noout -out ec_private_device1.pem
sudo openssl req -new -sha256 -key ec_private_device1.pem -out ec_cert_device1.csr -subj "/CN=unused-device"
sudo openssl x509 -req -in ec_cert_device1.csr -CA ca_cert_registry.pem -CAkey ca_private_registry.pem -CAcreateserial -sha256 -out ec_cert_device1.pem
gcloud iot devices create ${DEVICE} --region=${REGION}  --registry=${REGISTRY}  --public-key path=ec_cert_device1.pem,type=es256-x509-pem

# print info to copy to code
openssl ec -in ec_private_device1.pem -noout -text
echo "Copy private part of above to esp8266 code"