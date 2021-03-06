const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const checkCSRF = require('./checkCSRF')

//generate app
const app = express();
app.set('trust proxy', 1);

//set env
require('dotenv').config();
const config = require('./config/config.js')[process.env.NODE_ENV || 'development'];

//set middleware
app.use(logger('dev'));
app.use(cors({
  origin: `https://${process.env.CLIENT_HOST}`,
  credentials: true,
  optionsSuccessStatus: 200,
}))
app.use(checkCSRF)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.define('Sessions', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
})

app.use(session({
  secret: 'node_app_template',
  resave: true,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    secure: true,
    sameSite: 'none',
  },
  store: new SequelizeStore({
    db: sequelize,
    table: "Sessions",
  })
}))

//set Routing
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
});

module.exports = app;
