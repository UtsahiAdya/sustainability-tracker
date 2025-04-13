module.exports = function ensureAuthenticated(req, res, next) {
  console.log("Authenticated User:", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized access" });
};
