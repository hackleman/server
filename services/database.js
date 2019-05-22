const config = require('../config/database');
const server = require('../config/server');
const oracledb = require('oracledb');
const iphandle = require('ip');


/*
    Initialize and execute functions
    for the Oracle database server.
    Also connects to Cisco VPN upon initialization
*/

async function initialize(){
/*
  Checks to see if VPN connection is already established
  if so it awaits VPN connection then creates connection pool
*/

  await oracledb.createPool(config.CISEPool);

  console.log("Oracle DB Connection Success");
}
/*
  Closes the Oracle connection pool
 */
async function close(){

  await oracledb.getPool().close();
}

function simpleExecute(statement, binds = [], opts = {}) {

  return new Promise(async (resolve, reject) => {

    let conn;
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

/*
  This tries to get a connection from our connection pool.
  If a connection exists in the pool it executes the statement with specified binds
*/
    try {

      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);

    } catch (err) {
      reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.simpleExecute = simpleExecute;
module.exports.close = close;
module.exports.initialize = initialize;
