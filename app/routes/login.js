var express = require('express');
var router = express.Router();
const passport = require('../auth')

router.use(passport.initialize())
router.use(passport.session())

router.get('/login', (req, res, next) => {
  res.send({ name: 'ログインしてください'})
});

router.post('/login',
  passport.authenticate('local', { session: true }),
  (req, res) => {
    // res.cookie('hoge', 'hoge', {
    //   httpOnly: true,
    //   maxAge: 60000,
    //   secure: true,
    //   sameSite: 'none',
    // })

    console.log("==============")
    console.log(req.session.hoge)
    req.session.hoge = "hoge"
    console.log(req.session.hoge)
    console.log("==============")

    res.json( {result: req.user })
  }
)

router.get('/login/failure', (req, res) => {
  res.json({ result: 'false' })
})

router.get('/login/success', (req, res) => {
  res.json({ result: req.body.name })
})

router.post('/logout', (req, res) => {
  // req.session.passport.user = undefined;
  req.logout();
  res.json({ result: req.user })
})

module.exports = router;
