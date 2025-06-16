const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const baseRoutes = require("./routes/baseRoute");
const invRoutes = require("./routes/inventoryRoute");
const utilities = require("./utilities");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
//w05 
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const checkJWT = require("./middleware/checkJWT");
app.use(checkJWT);

// Set up session and flash middleware FIRST
app.use(session({
  secret: "superSecret",
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", baseRoutes);
app.use("/inv", invRoutes);

// 500 error handler
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const nav = await utilities.getNav();
  res.status(500).render("partials/error", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    nav
  });
});

// 404 handler
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("partials/error", {
    title: "404 Not Found",
    message: "The page you are looking for does not exist.",
    nav
  });
});

// ✅ Start server — this must be last
app.listen(port, () => {
  console.log(`🚗 Server running at http://localhost:${port}`);
});
