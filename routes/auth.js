const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")

router.get("/", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  })
  await req.session.destroy()
  res.render("index")
})

router.get("/login", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  })
  await req.session.destroy()
  res.render("login")
})

router.get("/protected", authController.verifyToken, (req, res) => {
  res.render("Confidential")
})
router.get("/signup", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  })
  await req.session.destroy()
  res.render("signup")
})

router.post("/userExists", authController.userNameExists)

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { username: req?.session?.user?.username || null })
})

router.post("/signup", authController.signup)

router.post("/login", authController.login)

module.exports = router
