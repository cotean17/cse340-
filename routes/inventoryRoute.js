const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");


router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to trigger a 500 error for testing
router.get("/error", (req, res, next) => {
  throw new Error("Intentional server error for testing");
});


router.get("/:classificationId", invController.buildByClassificationId);

module.exports = router;
