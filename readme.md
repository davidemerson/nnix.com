
install nginx, git, scdoc, and go
yum install nginx git scdoc go

get your certbot certs
certbot -d nnix.com -d www.nnix.com

or renew your certbot certs
certbot renew

clone satellite from sources at https://sr.ht/~gsthnz/satellite/

two web directories, make them if you need to
/nnix.com
/capsule

in the satellite directory,
make && make install

run satellite using your config and background it
satellite -c /nnix.com/satellite.toml &

copy crontab entries to /etc/crontab
cat /nnix.com/crontab > /etc/crontab