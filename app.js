const express = require("express");
const path = require("path");
const baseRoutes = require("./routes/baseRoute");
const invRoutes = require("./routes/inventoryRoute");
const utilities = require("./utilities");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Use routes
app.use("/", baseRoutes);
app.use("/inv", invRoutes);

// Error handler (500)
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const nav = await utilities.getNav();
  res.status(500).render("partials/error", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    nav
  });
});

// 404 handler (must be last)
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("partials/error", {
    title: "404 Not Found",
    message: "The page you are looking for does not exist.",
    nav
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
