require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const cookieParser = require("cookie-parser");
const checkJWT = require("./middleware/checkJWT");

const baseRoutes = require("./routes/baseRoute");
const invRoutes = require("./routes/inventoryRoute");
const accountRoutes = require("./routes/accountRoute");
const favoritesRoute = require("./routes/favoritesRoute");

const utilities = require("./utilities");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Static and parsing middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ✅ Session and flash middleware
app.use(cookieParser());         // Must be before checkJWT
app.use(session({
  secret: "superSecret",
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// ✅ JWT middleware
app.use(checkJWT);

// ✅ Global variables for all views
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || false;
  res.locals.firstname = res.locals.accountData?.account_firstname || "";
  next();
});

// ✅ Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Routes
app.use("/", baseRoutes);
app.use("/inv", invRoutes);
app.use("/account", accountRoutes);
app.use("/favorites", favoritesRoute); // <-- placed with other routes

// ✅ 500 Error handler
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const nav = await utilities.getNav();
  res.status(500).render("partials/error", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    nav
  });
});

// ✅ 404 Error handler
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("partials/error", {
    title: "404 Not Found",
    message: "The page you are looking for does not exist.",
    nav
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚗 Server running at http://localhost:${port}`);
});
