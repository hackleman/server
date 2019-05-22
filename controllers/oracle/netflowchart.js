const netflowchart = require('../../database/oracle/netflowchart.js');

async function get(req, res, next) {
  try {
    const context = {};

      context.zone = parseInt(req.query.zone, 10);

    const rows = await netflowchart.find(context);

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
