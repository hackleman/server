const database = require('../../services/database.js');

const basequery =
'WITH QUERY1 AS(SELECT pickuptime, TRIPID AS tripid FROM TRIP),';

async function find() {
  let query = basequery;
  const binds = {};
  query += "SNOWQ AS(SELECT COUNT(QUERY1.TRIPID) AS snowtrips, weather.time AS time FROM WEATHER, QUERY1 WHERE Condition = 'Snow' AND  extract(hour from QUERY1.pickuptime) = extract(hour from weather.time) AND extract(DAY from QUERY1.pickuptime) = extract(DAY from weather.time) AND  extract(MONTH from QUERY1.pickuptime) = extract(MONTH from weather.time) GROUP BY Condition, weather.time),";
  query += "CLEARQ AS(SELECT COUNT(QUERY1.TRIPID) AS cleartrips, weather.time AS time FROM WEATHER, QUERY1 WHERE Condition IN ('Clear','Clouds')	 AND  extract(hour from QUERY1.pickuptime) = extract(hour from weather.time) AND extract(DAY from QUERY1.pickuptime) = extract(DAY from weather.time) AND  extract(MONTH from QUERY1.pickuptime) = extract(MONTH from weather.time) GROUP BY Condition, weather.time),";
  query += "RAINQ AS(SELECT COUNT(QUERY1.TRIPID) AS raintrips, weather.time AS time FROM WEATHER, QUERY1 WHERE Condition IN ('Rain', 'Thunderstorm', 'Drizzle', 'Squall') AND  extract(hour from QUERY1.pickuptime) = extract(hour from weather.time) AND extract(DAY from QUERY1.pickuptime) = extract(DAY from weather.time) AND  extract(MONTH from QUERY1.pickuptime) = extract(MONTH from weather.time) GROUP BY Condition, weather.time),";
  query += "SNOWAVG AS(SELECT extract(hour from time) as hour, AVG(SNOWQ.snowtrips) as SNOW FROM SNOWQ GROUP BY extract(hour from time) ORDER BY extract(hour from time)),";
  query += "CLEARAVG AS(SELECT extract(hour from time) as hour, AVG(CLEARQ.cleartrips) as CLEAR FROM CLEARQ GROUP BY extract(hour from time) ORDER BY extract(hour from time)),";
  query += "RAINAVG AS(SELECT extract(hour from time) as hour, AVG(RAINQ.raintrips) as RAIN FROM RAINQ GROUP BY extract(hour from time) ORDER BY extract(hour from time))";
  query += "SELECT hour, CLEAR, RAIN, SNOW FROM SNOWAVG NATURAL JOIN RAINAVG NATURAL JOIN CLEARAVG ORDER BY hour";

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
