const database = require('../../services/database.js');

const baseQuery =
'SELECT * from GEOZONE';


async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.locationID = context.id;

    query += '\nwhere ZONEID = :locationID';
  }
console.log(query);
  const result = await database.simpleExecute(query, binds);
  console.log(result);
  return result.rows;
}

module.exports.find = find;
