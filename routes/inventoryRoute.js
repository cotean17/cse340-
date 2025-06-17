const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const checkAccountType = require("../middleware/accountTypeCheck");

// ✅ Protected routes
router.get("/", checkAccountType, invController.buildManagement);

router.get("/add-classification", checkAccountType, invController.buildAddClassification);
router.post("/add-classification", checkAccountType, invController.insertClassification);

router.get("/add-inventory", checkAccountType, invController.buildAddInventory);
router.post("/add-inventory", checkAccountType, invController.insertInventory);

// ✅ Public vehicle detail view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// ✅ Trigger a 500 error (public)
router.get("/error", (req, res, next) => {
  throw new Error("Intentional server error for testing");
});

// ✅ Classification view route (must be last)
router.get("/:classificationId", invController.buildByClassificationId);

module.exports = router;
