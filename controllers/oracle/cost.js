const cost = require('../../database/oracle/cost.js');

async function get(req, res, next) {
  try {
    const context = {};
oracle
      context.hour = parseInt(req.query.hour, 10);


    const rows = await cost.find(context);

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
