const aggregate = require('../../database/oracle/aggregate.js');

async function get(req, res, next) {
  try {
    const context = {};
      console.log(req.query);
    context.zone1 = parseInt(req.query.zone1, 10);
    context.trip = parseInt(req.query.trip, 10);

    const rows = await aggregate.find(context);

    if (req.query.zone1) {

        res.status(200).json(rows);

    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next (err);
  }
}

module.exports.get = get;
