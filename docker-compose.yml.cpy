version: '3'

services: 
  
  app: 
    container_name: docker-node-mongo
    restart: always 
    build: .
    ports:
      - '4000:4000'
      - '8001:8001'
  oracle-xe:
    container_name: oracle-xe
    image: hackleman/oracleproject
    ports:
      - '32118:1521'
      - '35518:5500'
    volumes:
      - ../data/oracle:/opt/oracle/oradata
    environment:
      - ORACLE_PWD=Oracle18   
  nginx:
    container_name: webserver
    image: nginx:mainline-alpine
    restart: unless-stopped
    ports: 
     - '80:80'
     - '443:443'
    volumes:
      - ../data/temp:/tmp
      - ./public:/var/www/html
      - ./data/nginx:/etc/nginx/conf.d
      - ../data/certbot/etc:/etc/letsencrypt
      - ../data/certbot/var:/var/lib/letsencrypt
      - ./data/dhparam:/etc/ssl/certs
  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ../data/certbot/etc:/etc/letsencrypt
      - ../data/certbot/var:/var/lib/letsencrypt
      - ./public:/var/www/html
    command: certonly --webroot --webroot-path=/var/www/html --email hackleman.jason@gmail.com --agree-tos --no-eff-email --staging  -d taxidata.tk  -d www.taxidata.tk
