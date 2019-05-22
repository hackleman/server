const aggregate = require('../../database/oracle/netflow.js');

async function get(req, res, next) {
  try {
    const context = {};
      console.log(req.query);
      context.hour = parseInt(req.query.hour, 10);


    const rows = await aggregate.find(context);

    if (req.query) {

        res.status(200).json(rows);

    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next (err);
  }
}

module.exports.get = get;
