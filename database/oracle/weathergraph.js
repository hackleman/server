const database = require('../../services/database.js');

const basequery =
'WITH QUERY1 AS(SELECT CAST(TRUNC(PICKUPTIME, \'hh24\') AS TIMESTAMP) AS timestamp, (extract(minute from (dropofftime - pickuptime))*60 + extract(second from (dropofftime - pickuptime))) AS DATEDIFF, TRIPID AS tripid  FROM TRIP),';

async function find(context) {
  let query = basequery;
  const binds = {};
  query += 'QUERY2 AS(SELECT QUERY1.TRIPID AS TRIPID, QUERY1.DATEDIFF AS DATEDIFF, WEATHER.TIME AS wtimestamp, Temperature, Windspeed, Condition FROM WEATHER, QUERY1 WHERE WEATHER.TIME = QUERY1.timestamp),'
  query += 'QUERY3 AS(SELECT QUERY2.TRIPID AS TRIPID, QUERY2.DATEDIFF AS datediff, QUERY2.wtimestamp AS wtimestamp, CEIL(QUERY2.Temperature/5)*5 AS temperature, QUERY2.Windspeed AS windspeed, QUERY2.Condition AS condition, YELLOWTRIP.DISTANCE AS distance, YELLOWTRIP.TOTALCOST AS totalcost FROM QUERY2, YELLOWTRIP WHERE QUERY2.TRIPID = YELLOWTRIP.TRIPID)'

  if (context.type == 1) {
      query += 'SELECT AVG(datediff/distance) AS triptime, windspeed FROM QUERY3 GROUP BY windspeed ORDER BY WINDSPEED ASC';
  } else if (context.type == 2) {
      query += 'SELECT AVG(datediff/distance) AS triptime, temperature FROM QUERY3 GROUP BY temperature ORDER BY  temperature ASC';
  } else if (context.type == 3){
      query += 'SELECT AVG(datediff/distance) AS triptime, condition FROM QUERY3 GROUP BY condition';
  } else if (context.type == 4) {
      query += 'SELECT AVG(totalcost/distance) AS avgcost, temperature FROM QUERY3 GROUP BY temperature ORDER BY  temperature ASC';
  } else if (context.type == 5){
      query += 'SELECT AVG(totalcost/distance) AS avgcost, condition FROM QUERY3 GROUP BY condition';
  } else if (context.type == 6){
      query += 'SELECT AVG(totalcost/distance) AS avgcost, windspeed FROM QUERY3 GROUP BY windspeed ORDER BY  windspeed ASC';
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
