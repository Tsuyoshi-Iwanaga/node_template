const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models').User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  User.findOne({
    where: {
      email: email
    }
  })
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      return done(null, user) //login success
    }
    throw new Error()
  })
  .catch(error => {
    return done(null, false, { message: '認証に一致するレコードが存在しません' })
  })
}))

//Session
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport