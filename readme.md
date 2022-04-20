# An http server and a gemini server
(or at least a pile of configs for them)

## install nginx, git, scdoc, and go
yum install nginx git scdoc go

## clone this repo to /web/nnix.com/

## clone the capsule repo to /web/nnix.com/capsule

## copy nginx.conf over
cp /web/nnix.com/nginx.conf /etc/nginx/nginx.conf

## get your certbot certs
certbot -d nnix.com -d www.nnix.com

## or renew your certbot certs
certbot renew

## clone satellite from sources at https://sr.ht/~gsthnz/satellite/

## in the satellite directory,
make && make install

## move your service description for satellite to systemd
cp /web/nnix.com/satellite.service /etc/systemd/system/

## enable nginx and satellite
systemctl enable nginx.service
systemctl enable satellite.service

## copy crontab entries to the ec2-user crontab
crontab -e (and paste)

# Molly Brown Instead
## get mb sources
go get tildegit.org/solderpunk/molly-brown

## copy binary
cp ~/go/bin/molly-brown /usr/bin

## make keys
openssl req -new -subj "/CN=nnix.com" -x509 -newkey ec -pkeyopt ec_paramgen_curve:secp521r1 -pkeyopt ec_param_enc:named_curve -days 3650 -nodes -out /web/certs/nnix.com.pem -keyout /web/certs/nnix.com.key

## chmod keys
chmod 400 /web/certs/nnix.com.*

## add service
cp /web/nnix.com/mollybrown.service /etc/systemd/system/

## enable service
systemctl enable mollybrown.service