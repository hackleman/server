const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('../config/database');
const users = require('../routes/users');
const morgan = require('morgan');

let server;

function initialize() {

  return new Promise((resolve, reject) => {
    mongoose.connect(config.Mongoose.database, {useNewUrlParser: true});

    mongoose.connection.on('connected', () => {
	    console.log('Connected to MongoDB');
    }); 
    mongoose.connection.on('error', () => {
	    console.log('Database error: ' + err);
    });

    // On Connection

    const app = express();

    server = http.createServer(app);
    // Set Heroku port
    const port = 4000;

    app.use(morgan('combined'));
    app.use(express.static('./public'));

    // CORS MiddleWare
    app.use(cors());

    // Body Parser MiddleWare
    app.use(bodyParser.json());

    // Passport MiddleWare
    app.use(passport.initialize());
    app.use(passport.session());

    require('../config/passport.js')(passport);

    // Default Database Startup message after Get '/'
    app.use('/users', users);

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
