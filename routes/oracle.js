const express = require('express');
const router = new express.Router();

// Bring in oracle controllers
const yellowtrips = require('../controllers/oracle/yellowtrips');
const zones = require('../controllers/oracle/zones');
const totals = require('../controllers/oracle/totals');
const aggregate = require('../controllers/oracle/aggregate');
const netflow = require('../controllers/oracle/netflow');
const cost = require('../controllers/oracle/cost');
const timegraph = require('../controllers/oracle/timegraph');
const weathergraph = require('../controllers/oracle/weathergraph');
const weathertripavg = require('../controllers/oracle/weathertripavg');
const weathermap = require('../controllers/oracle/weathermap');
const netflowchart = require('../controllers/oracle/netflowchart');


// routes to oracle sql queries
router.route('/yellowtrips/:id?')
  .get(yellowtrips.get);

router.route('/zones/:id?')
  .get(zones.get);

router.route('/aggregate/')
  .get(aggregate.get);

router.route('/netflow/')
  .get(netflow.get);

router.route('/cost/')
  .get(cost.get);

router.route('/timegraph/')
  .get(timegraph.get);

router.route('/weathergraph/')
  .get(weathergraph.get);

router.route('/weathertripavg/')
  .get(weathertripavg.get);

router.route('/weathermap/')
  .get(weathermap.get);

router.route('/netflowchart/')
  .get(netflowchart.get);

router.route('/totals/')
  .get(totals.get);




module.exports = router;
