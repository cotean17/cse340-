const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ===== View Builders =====
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

async function buildUpdate(req, res) {
    const nav = await utilities.getNav();
  
    // Safely decode the JWT token again
    const token = req.cookies.jwt;
  
    if (!token) {
      req.flash("message", "Please log in to access your account.");
      return res.redirect("/account/login");
    }
  
    let accountData;
    try {
      accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      req.flash("message", "Invalid session. Please log in again.");
      return res.redirect("/account/login");
    }
  
    res.render("account/update", {
      title: "Update Account",
      nav,
      account: accountData,
      message: req.flash("message"),
      errors: null
    });
  }
  

// ===== Auth Functions =====
async function registerAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    const hashedPassword = await bcrypt.hash(account_password, 10);
  
    try {
      const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
      );
  
      if (regResult) {
        req.flash("message", "Account successfully registered. Please log in.");
        return res.redirect("/account/login");
      }
    } catch (error) {
      if (error.message.includes("duplicate key value")) {
        req.flash("message", "An account with that email already exists. Please log in.");
      } else {
        req.flash("message", "Registration failed. Please try again.");
      }
      return res.redirect("/account/register");
    }
  }
  

  async function loginAccount(req, res) {
    const { account_email, account_password } = req.body;
    try {
      const accountData = await accountModel.getAccountByEmail(account_email);
  
      if (!accountData) {
        req.flash("message", "Account not found. Please register.");
        return res.redirect("/account/login");
      }
  
      const match = await bcrypt.compare(account_password, accountData.account_password);
  
      if (!match) {
        req.flash("message", "Incorrect password. Please try again.");
        return res.redirect("/account/login");
      }
  
      const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
  
      return res.redirect("/account/management");
    } catch (error) {
      console.error("Login error:", error);
      req.flash("message", "Login failed due to a server error. Please try again.");
      return res.redirect("/account/login");
    }
  }
  

function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("message", "You have been logged out.");
  res.redirect("/");
}

// ===== Update Functions =====
async function updateAccount(req, res) {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
  
    if (updateResult) {
      // 🔁 Re-sign JWT with the updated data
      const token = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h"
      });
  
      res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
  
      req.flash("message", "Account information updated.");
      return res.redirect("/account/update");
    }
  
    req.flash("message", "Update failed.");
    res.redirect("/account/update");
  }
  

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("message", "Password updated successfully.");
    return res.redirect("/account/management");
  }

  req.flash("message", "Password update failed.");
  res.redirect("/account/update");
}

// ===== Export Everything =====
module.exports = {
  buildLogin,
  buildRegister,
  buildManagement,
  buildUpdate,
  registerAccount,
  loginAccount,
  logout,
  updateAccount,
  updatePassword
};
