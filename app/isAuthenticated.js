function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(403).json({ result: "request is unauthorized"})
  }
}

module.exports = isAuthenticated