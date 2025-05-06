const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function userNameExists(req, res) {
  try {
    const { username } = req.body
    const user = await User.find({ username })
    if (user.length > 0) {
      return res.status(200).json({ exists: true })
    } else {
      return res.status(200).json({ exists: false })
    }
  } catch (err) {
    console.error("Error checking user existence", err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

const signup = async (req, res) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedPassword })
    await user.save()
    return res.status(201).json({ message: "User created successfully" })
  } catch (err) {
    console.error("Error creating user", err)
  }
}

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token
  try {
    const verifiedToken = await jwt.verify(token, process.env.SECRET_TOKEN)
    if (!verifiedToken) {
      return res.status(403).redirect("/")
    }
    // res.status(200).redirect("/protectedPage")
    next()
  } catch (err) {
    res.status(500).json("Error verifying token")
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user == null) return res.status(401).json({ message: "Invalid User" })
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Username or password" })
    }
    const token = await jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "1m",
      }
    )
    res.cookie("token", token, {
      httpOnly: true,
    })

    req.session.user = user
    return res.status(200).redirect("dashboard")
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
module.exports = { signup, login, userNameExists, verifyToken }
