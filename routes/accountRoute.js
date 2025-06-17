const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// GET
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.get("/management", accountController.buildManagement);
router.get("/logout", accountController.logout);
router.get("/update", accountController.buildUpdate);

// POST
router.post("/login", accountController.loginAccount);
router.post("/register", accountController.registerAccount);
router.post("/update", accountController.updateAccount);
router.post("/update-password", accountController.updatePassword);

module.exports = router;
