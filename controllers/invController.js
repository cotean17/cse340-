const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId);
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data.length > 0 ? data[0].classification_name : "Vehicles";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid
    });
  } catch (error) {
    next(error);
  }
}

async function buildByInventoryId(req, res, next) {
    try {
      const invId = parseInt(req.params.inv_id);
      const data = await invModel.getVehicleById(invId);
  
      if (!data) {
        throw new Error("Vehicle not found");
      }
  
      const nav = await utilities.getNav();
      const detail = await utilities.buildVehicleDetail(data);
  
      res.render("./inventory/details.ejs", {
        title: `${data.inv_make} ${data.inv_model}`,
        nav,
        detail
      });
  
    } catch (error) {
      next(error);
    }
  }
  
  

module.exports = {
  buildByClassificationId,
  buildByInventoryId
};
