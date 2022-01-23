var express = require('express')
var router = express.Router()
const passport = require('../auth')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const isAuthenticated = require('../isAuthenticated')
const MailSender = require('../mailsend')
const User = require('../models').User
const PasswordForget = require('../models').PasswordForget

require('dotenv').config();

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
  .catch(err => {
    return res.status(403).json({message: '対象のユーザが存在しません'})
  })
})

const passwordEmailValidationRules = [
  check('email')
  .not().isEmpty().withMessage('この項目は必須です')
  .isEmail().withMessage('有効なメールアドレス形式で入力ください')
  .custom((val, { req }) => {
    return User.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(user => {
      if(!user) {
        throw new Error('このメールアドレスに一致するユーザが見つかりませんでした')
      }
    })
  })
]

router.post('/forget', [passwordEmailValidationRules] , (req, res) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const email = req.body.email
  const randomStr = Math.random().toFixed(36).substring(2, 38)
  const token = crypto.createHmac('sha256', process.env.APP_KEY).update(randomStr).digest('hex')
  const url = process.env.CLIENTORIGIN + '/forget/reset?token=' + token + '&email=' + encodeURIComponent(email)

  PasswordForget.findOrCreate({
    where: {
      email: email
    },
    default: {
      email: email,
      token: token,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
  .then(([passwordForget, created]) => {
    if(!created) {
      passwordForget.token = token
      passwordForget.createdAt = new Date()
      passwordForget.updatedAt = new Date()
      passwordForget.save()
    }
  })

  const sender = new MailSender({
    to: email,
    subject: 'パスワード再発行',
    text: '以下のURLをクリックしてパスワードを再発行してください。\n'+ url,
    html: '以下のURLをクリックしてパスワードを再発行してください。<br>'+ url,
  })

  sender.send()
  .then(result => {
    return res.json(result)
  })
  .catch(err => {
    return res.status(500).json({ message: "メールが送信できませんでした"})
  })
})

const passwordResetValidationRules = [
  check('email')
  .not().isEmpty().withMessage('この項目は必須入力です')
  .isEmail().withMessage('有効なメールアドレス形式で入力してください')
  .custom((val, { req }) => {
    return User.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(user => {
      if(!user) {
        throw new Error('メールアドレスに一致するユーザが存在しません')
      }
    })
  }),
  check('pass_new')
  .not().isEmpty().withMessage('この項目は必須項目です')
  .custom((val, { req }) => {
    if(req.body.pass_new !== req.body.pass_confirm) {
      throw new Error('パスワードが一致しません')
    }
    return true
  })
]

router.post('/forget/reset', [passwordResetValidationRules], (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const email = req.body.email
  const pass_new = req.body.pass_new
  const token = req.body.token
  
  PasswordForget.findOne({
    where: {
      email: email
    },
    include: [
      { model: User }
    ]
  })
  .then(passwordReset => {
    if(passwordReset && passwordReset.token === token && passwordReset.User) {
      const user = passwordReset.User
      user.password = bcrypt.hashSync(pass_new, bcrypt.genSaltSync(8))
      user.save()
      passwordReset.destroy()

      return res.json({ result: 'パスワード変更が完了しました'})
    } else {
      return res.status(422).json({ message: 'パスワード変更が正常に完了しませんでした' })
    }
  })
  .catch(err => {
    return res.status(500).json({ message: "メールが送信できませんでした"})
  })
})

module.exports = router;