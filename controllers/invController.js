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
  
  async function buildManagement(req, res, next) {
    try {
      const nav = await utilities.getNav();
      res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        message: req.flash("message"),
      });
    } catch (error) {
      next(error);
    }
  }
  

// Show the add classification form
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("message"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

// Handle classification insert
async function insertClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    const nav = await utilities.getNav();

    const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
      req.flash("message", "New classification added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Classification insert failed.");
      res.status(500).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: req.flash("message"),
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

// Render add-vehicle form
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getAllClassifications();
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classifications,
      errors: [],
      message: req.flash("message"),
      formData: {},
    });
  } catch (err) {
    next(err);
  }
}

// Handle POST add-vehicle
async function insertInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getAllClassifications();
    const formData = req.body;

    const requiredFields = [
      "classification_id",
      "inv_make",
      "inv_model",
      "inv_year",
      "inv_description",
      "inv_image",
      "inv_thumbnail",
      "inv_price",
      "inv_miles",
      "inv_color",
    ];

    const errors = requiredFields.filter(field => !formData[field] || formData[field].trim() === "");
    if (errors.length > 0) {
      return res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classifications,
        errors: ["All fields are required."],
        message: [],
        formData,
      });
    }

    await invModel.addVehicle(formData);
    req.flash("message", "Vehicle successfully added.");
    res.redirect("/inv");
  } catch (error) {
    next(error);
  }
}


module.exports = {
  buildByClassificationId,
  buildByInventoryId,
  buildManagement,
  buildAddClassification,
  insertClassification,
  buildAddInventory,      
  insertInventory
};

