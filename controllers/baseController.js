const utilities = require("../utilities/index")

const buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}

module.exports = { buildHome }

