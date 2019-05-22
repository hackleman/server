const weathertripavg = require('../../database/oracle/weathertripavg.js');

async function get(req, res, next) {
  try {

    const rows = await weathertripavg.find();

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
