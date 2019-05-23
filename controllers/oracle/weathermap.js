const weathermap = require('../../database/oracle/weathermap.js');

async function get(req, res, next) {
  try {
    const context = {};

      context.temperature = parseInt(req.query.temperature, 10);
      context.windspeed = parseInt(req.query.windspeed, 10);
      context.type = parseInt(req.query.type, 10);

    const rows = await weathermap.find(context);

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
