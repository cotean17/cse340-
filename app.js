const express = require("express")
const path = require("path")
const baseRoute = require("./routes/baseRoute")
const app = express()

require("dotenv").config()

const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/", baseRoute)

// 404
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The page you are looking for doesn't exist.",
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
