Note :: I used to host this site on an ec2 instance, but now it's on a third party (FM) provider. This is where I keep molly brown configs and reference former redirects now.


# An http server and a gemini server
(or at least a pile of configs for them)

## launch an EC2 t4g.nano
- running amazon linux 64-bit arm
- 30GB gp2 storage on the root volume

## acquire an Elastic IP, if you don't have a free one already.

## associate the Elastic IP with the instance you launched just now.

## set your A record to the Elastic IP in question

## log in (ssh) to the EC2 you just made

## edit hostname
sudo nano /etc/hostname
sudo reboot

## install basic updates
sudo yum update

## install nginx from linux-extras
sudo amazon-linux-extras install nginx1

## install epel
sudo amazon-linux-extras install epel

## install git, scdoc, certbot, bind and go
yum install git scdoc go certbot-nginx

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