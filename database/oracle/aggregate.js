const database = require('../../services/database.js');

const baseQuery =
'WITH QUERY1 AS(SELECT TRIPID AS tripID, (extract(minute from (dropofftime - pickuptime))*60 + extract(second from (dropofftime - pickuptime))) AS DATEDIFF, PICKUPTIME AS starttime, DROPOFFTIME AS endtime, geo1.ZONEID AS pickupzone, geo2.zoneid AS endzone FROM TRIP, GEOZONE geo1, GEOZONE geo2 WHERE geo1.ZONEID = TRIP.PICKUPZONE AND geo2.ZONEID = TRIP.DROPOFFZONE)';


async function find(context) {
  let query = baseQuery;


  if (context.trip === 1) {
    query += ', QUERY2 AS(SELECT * FROM QUERY1 NATURAL JOIN GREENTRIP)';
    console.log(query);
  }
  else if (context.trip === 2) {
    query += ', QUERY2 AS(SELECT * FROM QUERY1 NATURAL JOIN YELLOWTRIP)';
    console.log(query);
  } else if (context.trip === 3){
    query += ', QUERY2 AS(SELECT * FROM QUERY1 WHERE tripID NOT IN(SELECT TRIPID FROM YELLOWTRIP UNION SELECT TRIPID FROM GREENTRIP))'
    console.log(query);
  } else {
    query += ', QUERY2 AS(SELECT * FROM QUERY1)';
  }

  const binds = {};

  if (context.zone1) {

    binds.startingzone = context.zone1;
  //  binds.type = context.type;

    query += ' SELECT ROUND(AVG(DATEDIFF)) AS triptime, endzone FROM QUERY2 WHERE pickupzone = :startingzone GROUP BY endzone'

  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
