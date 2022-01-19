const createError = require('http-errors');
const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

//generate app
const app = express();
app.set('trust proxy', 'uniquelocal');

//set env
require('dotenv').config();

//set middleware
app.use(logger('dev'));
app.use(cors({
  origin: process.env.CLIENTORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'node_app_template',
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60000,
    secure: true,
    sameSite: 'none',
  }
}))

//set Routing
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/login'));

//404
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send({ name: 'Error!', status: err });
});

module.exports = app;
