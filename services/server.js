const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('../config/database');
const router = require('../routes/oracle');
const port = require('../config/server');

const database = require('./database.js');

let httpServer;

function initialize() {

  return new Promise((resolve, reject) => {

    const app = express();

    // set up server with http module
    httpServer = http.createServer(app);

    // morgan for console debugging
    app.use(morgan('combined'));

    // CORS MiddleWare
    app.use(cors());

    // Default Database Startup message after Get '/'
    app.get('/', async (req, res) => {

      const result = await database.simpleExecute('select user, systimestamp from dual');
      const user = result.rows[0].USER;
      const date = result.rows[0].SYSTIMESTAMP;

      res.end(`DB user: ${user}\nDate: ${date}`);
    });

    // User main server for Oracle related routes
    app.use('/database/', router);

    httpServer.listen(port.server)
    .on('listening', () => {
      console.log('Web server listening on localhost:', port.server);
      resolve();
    })
    .on('error', err => {
      reject(err);
    });
  });
}

function close() {

  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;
module.exports.initialize = initialize;
