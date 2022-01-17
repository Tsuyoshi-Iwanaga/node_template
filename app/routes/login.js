var express = require('express');
var router = express.Router();
const passport = require('../auth')

router.use(passport.initialize())
router.use(passport.session())

router.get('/login', (req, res, next) => {
  res.send({ name: 'ログインしてください'})
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login/failure',
    successRedirect: '/login/success'
  })
)

router.get('/login/failure', (req, res) => {
  res.send('Failure')
})

router.get('/login/success', (req, res) => {
  res.send(req.body.name)
})

router.post('/logout', (req, res) => {
  // req.session.passport.user = undefined;
  req.logout();
  res.send('logout')
})

module.exports = router;
