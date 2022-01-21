var express = require('express');
var router = express.Router();
const passport = require('../auth')
const bcrypt = require('bcryptjs')
const User = require('../models').User;

router.use(passport.initialize())
router.use(passport.session())

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json(req.user)
  }
)

router.post('/logout', (req, res) => {
  req.logout();
  res.json(req.user)
})

router.post('/create', (req, res) => {
  if(req.body.name && req.body.email && req.body.password) {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
      rememberToken: null,
      createdAt: new Date,
      updatedAt: new Date,
    })
    .then(user => {
      res.json(user)
    })
  } else {
    res.status(403).json({ message: "invalid request" })
  }
})

module.exports = router;