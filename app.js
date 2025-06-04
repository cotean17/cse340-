const express = require("express");
const path = require("path");
const baseRoutes = require("./routes/baseRoute");
const invRoutes = require("./routes/inventoryRoute"); // ✅ ADD THIS
const utilities = require("./utilities");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", baseRoutes);
app.use("/inv", invRoutes); // ✅ ADD THIS LINE

// ❌ REMOVE this duplicate 404
// app.use((req, res) => {
//   res.status(404).render("partials/error", { title: "Page Not Found" });
// });

// ✅ Keep this async 404 handler
app.use(async (req, res, next) => {
  res.status(404).render("partials/error", {
    title: "404 Not Found",
    message: "The page you are looking for does not exist.",
    nav: await utilities.getNav()
  });
});

app.use(async (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("partials/error", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    nav: await utilities.getNav()
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
