import express from "express"
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/logout", logout)
//USER CAN ONLY UPDATE HIS/HER PROFILE IF HE/SHE IS LOGGED IN protectedRoute is a middleware that checks if the user is logged in
router.put("/update-profile", protectedRoute, updateProfile)
//CHECKING IF THE USER IS LOGGED IN
router.get("/check", protectedRoute, checkAuth)

export default router
