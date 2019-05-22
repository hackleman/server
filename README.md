To run docker with mongo and node server:

docker-compose up

To run oracle server by itself:

 - Make sure container is deleted with hackleman/oracleproject image

    docker run -d -p 32118:1521 -p 35518:5500 -e ORACLE_PWD=Oracle18 --name=oracle-xe --volume C:\Users\hackl\docker\oracle-xe:/opt/oracle/oradata hackleman/oracleproject
