import express from "express"

const router = express.Router()

router.post("/login", (req, res) => {
  res.send("Hello from the auth route")
})
router.post("/signup", (req, res) => {
  res.send("Hello from the auth route")
})

router.post("/logout", (req, res) => {
  res.send("Hello from the Logout")
})

export default router
