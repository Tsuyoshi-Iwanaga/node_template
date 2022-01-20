function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.json(403, { result: "request is unauthorized"})
  }
}

module.exports = isAuthenticated