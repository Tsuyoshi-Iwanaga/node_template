require('dotenv').config();

function checkCSRF (req, res, next) {
  console.log(req.headers)
  if (("origin" in req.headers && process.env.CLIENT_ORIGIN === req.headers.origin) && //意図したオリジンか
    "x-requested-with" in req.headers && //X-Requested-Withの独自ヘッダを含むか
    (req.headers.host === process.env.APP_HOST)) { //正規サービスのホスト名であるか
    return next()
  } else {
    res.status(400).json({ result: "Invalid Request" })
  }
}
module.exports = checkCSRF