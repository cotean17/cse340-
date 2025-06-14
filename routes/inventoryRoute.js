const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// 🔹 Task 1: Management view route
router.get("/", invController.buildManagement);

// 🔹 Add Classification Routes (Task 2)
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.insertClassification);

// 🔹 Add Inventory Routes (Task 3 - placeholder for future)
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.insertInventory);

// 🔹 Vehicle Detail View
router.get("/detail/:inv_id", invController.buildByInventoryId);

// 🔹 Route to trigger a 500 error for testing
router.get("/error", (req, res, next) => {
  throw new Error("Intentional server error for testing");
});

// 🔹 Classification view route (MUST stay last)
router.get("/:classificationId", invController.buildByClassificationId);

module.exports = router;
