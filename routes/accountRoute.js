const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// GET login, registration, and management views
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.get("/management", accountController.buildManagement);
router.get("/logout", accountController.logout);

// POST login and register
router.post("/login", accountController.loginAccount);
router.post("/register", accountController.registerAccount);

module.exports = router;
