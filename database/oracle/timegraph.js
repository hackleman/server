const database = require('../../services/database.js');

const basequery =
'WITH QUERY1 AS(SELECT TRIPID AS tripID, extract(month from DROPOFFTIME) AS month, PICKUPTIME AS starttime, DROPOFFTIME AS endtime, geo1.ZONEID AS pickupzone, geo2.zoneid AS endzone  FROM  TRIP, GEOZONE geo1, GEOZONE geo2 WHERE geo1.ZONEID = TRIP.PICKUPZONE AND geo2.ZONEID = TRIP.DROPOFFZONE)';

async function find(context) {
  let query = basequery;
  const binds = {};
  if (context.timezone) {
    binds.zone = context.timezone
    query += ', QUERY2 AS( SELECT * FROM QUERY1 WHERE endzone = :zone)';
    query += 'SELECT COUNT(tripID) AS count, month FROM QUERY2 GROUP BY month ORDER BY month ASC';
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
