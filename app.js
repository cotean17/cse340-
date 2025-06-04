const express = require("express");
const path = require("path");
const baseRoutes = require("./routes/baseRoute");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", baseRoutes);

// 404 error page
app.use((req, res) => {
  res.status(404).render("partials/error", { title: "Page Not Found" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
