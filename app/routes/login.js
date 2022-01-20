var express = require('express');
var router = express.Router();
const passport = require('../auth')

router.use(passport.initialize())
router.use(passport.session())

router.get('/login', (req, res, next) => {
  res.send({ name: 'ログインしてください'})
});

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json( {result: req.user })
  }
)

router.post('/logout', (req, res) => {
  // req.session.passport.user = undefined;
  req.logout();
  res.json({ result: req.user })
})

module.exports = router;
