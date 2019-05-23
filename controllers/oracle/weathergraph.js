const weathergraph = require('../../database/oracle/weathergraph.js');

async function get(req, res, next) {
  try {
    const context = {};

      context.type = parseInt(req.query.type, 10);

    const rows = await weathergraph.find(context);

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
