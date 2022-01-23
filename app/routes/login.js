var express = require('express')
var router = express.Router()
const passport = require('../auth')
const bcrypt = require('bcryptjs')
const isAuthenticated = require('../isAuthenticated')
const User = require('../models').User

router.use(passport.initialize())
router.use(passport.session())

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) { return next(err) }

    if(!user) { return res.status(403).json({ message: "入力内容に誤りがあります" }) }

    req.logIn(user, (err) => {
      if(err) { return res.status(403).json({ message: "ログインに失敗しました" }) }
      return res.json(user)
    })
  })(req, res, next)
})

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

router.post('/reset', isAuthenticated, (req, res, next) => {
  const now_pass = req.body.now_pass
  const new_pass = req.body.new_pass
  const confirm_pass = req.body.confirm_pass

  if(!now_pass || !new_pass || new_pass !== confirm_pass || now_pass === new_pass) {
    return res.status(403).json({message: '入力内容に誤りがあります / Error 001'})
  }

  User.findByPk(req.user.id)
  .then(user => {
    if (user && bcrypt.compareSync(now_pass, user.password)) {
      user.password = bcrypt.hashSync(new_pass, bcrypt.genSaltSync(8))
      user.updatedAt = new Date()
      user.save()
      req.logout();
      return res.json({message: 'パスワードの変更が完了しました'})
    }
    return res.status(403).json({message: '入力内容に誤りがあります'})
  })
  .catch(error => {
    return res.status(403).json({message: '対象のユーザが存在しません'})
  })
})

module.exports = router;