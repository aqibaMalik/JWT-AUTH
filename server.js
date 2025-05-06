require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const expressLayout = require("express-ejs-layouts")
const session = require("express-session")
const path = require("path")
const cookieParser = require("cookie-parser")

mongoose.connect(process.env.DB_STRING)
const db = mongoose.connection
db.on("open", () => console.log("mongodb connected"))

const app = express()
const authRouter = require("./routes/auth")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
)
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(expressLayout)
app.set("layout", "layout")
app.use(
  session({
    secret: process.env.SECRET_TOKEN,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, expires: 60000 },
  })
)
app.use("/", authRouter)

app.listen(process.env.PORT, () =>
  console.log(`Live Demo on http://localhost:${process.env.PORT}`)
)
