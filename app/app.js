const createError = require('http-errors');
const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//generate app
const app = express();

//set middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
}))
app.use(cookieParser());

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
  res.send({ name: 'Error!', status: err.status });
});

module.exports = app;
