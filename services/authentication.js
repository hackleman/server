const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('../config/database');
const users = require('../routes/users');

let server;

function initialize() {

  return new Promise((resolve, reject) => {

    mongoose.connect(config.Mongoose.database, {useNewUrlParser: true});

    // On Connection
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    // On Error
    mongoose.connection.on('error', (err) => {
      console.log('Database error: '+err);
    });

    const app = express();

    server = http.createServer(app);
    // Set Heroku port
    const port = 5000;


    // CORS MiddleWare
    app.use(cors());

    // Body Parser MiddleWare
    app.use(bodyParser.json());

    // Passport MiddleWare
    app.use(passport.initialize());
    app.use(passport.session());

    require('../config/passport.js')(passport);

    app.use('/users', users);
    // Default Database Startup message after Get '/'
    app.get('/', async (req, res) => {
        res.send('Invalid Endpoint');
    });

    app.listen(port, () => {
      console.log('Auth server listening on localhost: ' + port);
    });
  });
}

function close() {

  return new Promise((resolve, reject) => {
    server.close((err) => {
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
