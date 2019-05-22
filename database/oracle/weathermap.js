const database = require('../../services/database.js');

const basequery =
'WITH QUERY1 AS(SELECT CAST(TRUNC(PICKUPTIME, \'hh24\') AS TIMESTAMP) AS timestamp, (extract(minute from (dropofftime - pickuptime))*60 + extract(second from (dropofftime - pickuptime))) AS DATEDIFF, TRIPID AS tripid, PICKUPZONE AS zone  FROM TRIP)';

async function find(context) {
  let query = basequery;
  const binds = {};

  query += ', QUERY2 AS(SELECT QUERY1.TRIPID AS TRIPID, QUERY1.DATEDIFF AS DATEDIFF, QUERY1.ZONE AS ZONE, WEATHER.TIME AS wtimestamp, CEIL(Temperature/5)*5 AS temperature, Windspeed, Condition FROM WEATHER, QUERY1 WHERE WEATHER.TIME = QUERY1.timestamp)';
  query += ', QUERY3 AS(SELECT QUERY2.TRIPID AS TRIPID, QUERY2.DATEDIFF AS DATEDIFF, QUERY2.ZONE AS ZONE, QUERY2.wtimestamp AS wtimestamp, QUERY2.TEMPERATURE AS temperature, QUERY2.Windspeed AS windspeed, QUERY2.Condition AS condition, YELLOWTRIP.DISTANCE AS distance, YELLOWTRIP.TOTALCOST AS totalcost FROM QUERY2, YELLOWTRIP WHERE QUERY2.TRIPID = YELLOWTRIP.TRIPID)';

  if (context.temperature) {
    binds.temperature = context.temperature;
    query += ', QUERY4 AS(SELECT TRIPID AS TRIPID, totalcost AS totalcost, distance AS distance, zone AS zone FROM QUERY3 WHERE temperature = :temperature)';
    query += ', QUERY5 AS(SELECT zone AS zone, AVG(totalcost/distance) AS baseaverage FROM QUERY3 GROUP BY zone)';
    query += ', QUERY6 AS(SELECT zone AS zone, AVG(totalcost/distance) AS tempaverage FROM QUERY4 GROUP BY zone)';
    query += 'SELECT zone, (tempaverage-baseaverage) AS diff, baseaverage AS base, tempaverage AS temp FROM QUERY5 NATURAL JOIN QUERY6';
  }

  if (context.windspeed) {
    binds.windspeed = context.windspeed;
    query += ', QUERY4 AS(SELECT TRIPID AS TRIPID, totalcost AS totalcost, distance AS distance, zone AS zone FROM QUERY3 WHERE windspeed = :windspeed)';
    query += ', QUERY5 AS(SELECT zone AS zone, AVG(totalcost/distance) AS baseaverage FROM QUERY3 GROUP BY zone)';
    query += ', QUERY6 AS(SELECT zone AS zone, AVG(totalcost/distance) AS tempaverage FROM QUERY4 GROUP BY zone)';
    query += 'SELECT zone, (tempaverage-baseaverage) AS diff, baseaverage AS base, tempaverage AS temp FROM QUERY5 NATURAL JOIN QUERY6';
  }
  if(context.type) {
    if(context.type === 1) {

        query += ', QUERY4 AS(SELECT TRIPID AS TRIPID, totalcost AS totalcost, distance AS distance, zone AS zone FROM QUERY3 WHERE condition = \'Snow\')';
        query += ', QUERY5 AS(SELECT zone AS zone, AVG(totalcost/distance) AS baseaverage FROM QUERY3 GROUP BY zone)';
        query += ', QUERY6 AS(SELECT zone AS zone, AVG(totalcost/distance) AS tempaverage FROM QUERY4 GROUP BY zone)';
        query += 'SELECT zone, (tempaverage-baseaverage) AS diff, baseaverage AS base, tempaverage AS temp FROM QUERY5 NATURAL JOIN QUERY6';
    } else if (context.type === 2) {
        query += ', QUERY4 AS(SELECT TRIPID AS TRIPID, totalcost AS totalcost, distance AS distance, zone AS zone FROM QUERY3 WHERE condition = \'Rain\')';
        query += ', QUERY5 AS(SELECT zone AS zone, AVG(totalcost/distance) AS baseaverage FROM QUERY3 GROUP BY zone)';
        query += ', QUERY6 AS(SELECT zone AS zone, AVG(totalcost/distance) AS tempaverage FROM QUERY4 GROUP BY zone)';
        query += 'SELECT zone, (tempaverage-baseaverage) AS diff, baseaverage AS base, tempaverage AS temp FROM QUERY5 NATURAL JOIN QUERY6';
    } else {
        query += ', QUERY4 AS(SELECT TRIPID AS TRIPID, totalcost AS totalcost, distance AS distance, zone AS zone FROM QUERY3 WHERE condition = \'Clear\')';
        query += ', QUERY5 AS(SELECT zone AS zone, AVG(totalcost/distance) AS baseaverage FROM QUERY3 GROUP BY zone)';
        query += ', QUERY6 AS(SELECT zone AS zone, AVG(totalcost/distance) AS tempaverage FROM QUERY4 GROUP BY zone)';
        query += 'SELECT zone, (tempaverage-baseaverage) AS diff, baseaverage AS base, tempaverage AS temp FROM QUERY5 NATURAL JOIN QUERY6';
    }
  }



  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
