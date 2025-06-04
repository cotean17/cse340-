const utilities = require("../utilities/")

const buildHome = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}

module.exports = { buildHome }
