version: '3'

services: 
  
  app: 
    container_name: docker-node-mongo
    restart: always 
    build: .
    ports:
      - '4000:4000'
      - '5000:5000'
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
