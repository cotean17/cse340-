function checkAccountType(req, res, next) {
    const accountType = res.locals.account_type;
  
    if (accountType === "Employee" || accountType === "Admin") {
      return next();
    } else {
      req.flash("message", "You do not have permission to access that page.");
      return res.redirect("/account/login");
    }
  }
  
  module.exports = checkAccountType;
  