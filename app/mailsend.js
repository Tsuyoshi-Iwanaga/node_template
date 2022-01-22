const nodemailer = require('nodemailer')

//set env
require('dotenv').config();

class MailSender {

  constructor(settings) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    })

    this.message = {
      from: process.env.MAIL_FROM,
      to: settings.to,
      subject: settings.subject,
      text: settings.text,
      html: settings.html,
    }
  }

  send () {
    return this.transporter.sendMail(this.message)
  }
}

module.exports = MailSender