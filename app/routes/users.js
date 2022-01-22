const express = require('express')
const router = express.Router()
const passport = require('../auth')
const isAuthenticated = require('../isAuthenticated')
const User = require('../models').User
const MailSender = require('../mailsend')

router.use(passport.initialize())
router.use(passport.session())

router.get('/user', isAuthenticated, (req, res, next) => {
  res.json(req.user)
})

router.post('/mail', (req, res, next) => {
  const settings = {
    to: req.user.email,
    subject: 'testMail',
    text: 'testmail\ntestmail\ntestmail',
    html: 'testmail<br>testmail<br>testmail',
  }

  const sender = new MailSender(settings)

  sender.send()
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    res.status(500).json({ message: "failure mail sending"})
  })
})

module.exports = router;
