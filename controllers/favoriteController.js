const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities");

async function addFavorite(req, res, next) {
  const inv_id = req.params.inv_id;
  const account_id = res.locals.accountData.account_id;

  try {
    const existing = await favoritesModel.checkFavorite(account_id, inv_id);
    if (existing) {
      req.flash("message", "This vehicle is already in your favorites.");
    } else {
      await favoritesModel.addFavorite(account_id, inv_id);
      req.flash("message", "Vehicle added to favorites!");
    }
    res.redirect("/account/management");
  } catch (error) {
    next(error);
  }
}


async function showFavorites(req, res, next) {
  const account_id = res.locals.accountData.account_id;
  try {
    const nav = await utilities.getNav();
    const favorites = await favoritesModel.getFavorites(account_id);
    res.render("account/favorites", {
      title: "My Favorite Vehicles",
      nav,
      favorites,
      message: req.flash("message"),
      loggedin: true,
      firstname: res.locals.accountData.account_firstname
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addFavorite,
  showFavorites,
};
