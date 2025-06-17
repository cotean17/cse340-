const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkJWT(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.loggedin = false;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.locals.loggedin = false;
      return next();
    }

    res.locals.loggedin = true;
    res.locals.firstname = decoded.account_firstname;
    res.locals.account_type = decoded.account_type;

    // ✅ THIS LINE IS MISSING
    res.locals.accountData = decoded;

    next();
  });
}

module.exports = checkJWT;
