const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("message"),
    errors: null
  });
}

async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("message"),
    errors: null
  });
}

async function buildManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    message: req.flash("message")
  });
}

async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash("message", "Account successfully registered. Please log in.");
    res.redirect("/account/login");
  } else {
    req.flash("message", "Registration failed. Please try again.");
    res.redirect("/account/register");
  }
}

async function loginAccount(req, res) {
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("message", "Invalid credentials.");
    return res.redirect("/account/login");
  }

  const match = await bcrypt.compare(account_password, accountData.account_password);

  if (match) {
    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
    return res.redirect("/account/management");
  }

  req.flash("message", "Invalid credentials.");
  res.redirect("/account/login");
}

function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("message", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  buildManagement,
  registerAccount,
  loginAccount,
  logout
};
