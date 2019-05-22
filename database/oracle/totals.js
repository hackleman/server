const database = require('../../services/database.js');

const basequery =
'SELECT COUNT(*) AS TOTAL FROM TRIP';
async function find(context) {

  let query = basequery;
  const binds = {};
  if (context.total > 0) {
    binds.total = context.total
    query += ' WHERE PICKUPZONE = :total';
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;
