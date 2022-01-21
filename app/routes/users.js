const express = require('express');
const router = express.Router();
const passport = require('../auth')
const isAuthenticated = require('../isAuthenticated')
const User = require('../models').User;

router.use(passport.initialize())
router.use(passport.session())

router.get('/user', isAuthenticated, function(req, res, next) {
  res.json(req.user)
});

module.exports = router;
