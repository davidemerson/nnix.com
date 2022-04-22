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

## get mb sources
go get tildegit.org/solderpunk/molly-brown

## copy binary
cp ~/go/bin/molly-brown /usr/bin

## make keys
openssl req -new -x509 -days 3650 -nodes -out nnix_cert.pem -keyout nnix_key.pem

## chmod keys
chmod 400 /web/certs/nnix.com.*

## add service
cp /web/nnix.com/mollybrown.service /etc/systemd/system/

## enable nginx and satellite
systemctl enable mollybrown.service
systemctl enable nginx.service

## copy crontab entries to the ec2-user crontab
crontab -e (and paste)