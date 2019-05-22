const database = require('../../services/database.js');

const basequery =
'WITH QUERY1 AS(SELECT pickuptime, pickupzone, dropoffzone, TRIPID AS tripid FROM TRIP),';

async function find(context) {
  let query = basequery;
  const binds = {};
  if (context.zone) {
    binds.zone = context.zone
    query = "WITH INQ AS(SELECT COUNT(tripid) as daycount, extract(hour from pickuptime) as hour FROM TRIP WHERE dropoffzone = :zone GROUP BY extract(month from pickuptime), extract(day from pickuptime), extract(hour from pickuptime)), ";
    query += "INAVG AS(SELECT AVG(INQ.daycount) as inflow, INQ.hour FROM INQ GROUP BY INQ.hour), ";
	query += "OUTQ AS(SELECT COUNT(tripid) as daycount, extract(hour from pickuptime) as hour FROM TRIP WHERE pickupzone = :zone GROUP BY extract(month from pickuptime), extract(day from pickuptime), extract(hour from pickuptime)), ";
    query += "OUTAVG AS(SELECT AVG(OUTQ.daycount) as outflow, OUTQ.hour FROM OUTQ GROUP BY OUTQ.hour) ";
	query += "SELECT hour, inflow - outflow as netflow FROM INAVG NATURAL JOIN OUTAVG ORDER BY hour";
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
