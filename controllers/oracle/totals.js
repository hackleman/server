const totals = require('../../database/oracle/totals.js');

async function get(req, res, next) {
  try {
    const context = {};

    context.total= parseInt(req.query.total, 10);

    const rows = await totals.find(context);

    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next (err);
  }
}

module.exports.get = get;
