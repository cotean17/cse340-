const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoriteController");
const checkJWT = require("../middleware/checkJWT");

router.post("/add/:inv_id", checkJWT, favoritesController.addFavorite);
router.get("/", checkJWT, favoritesController.showFavorites);

module.exports = router;
