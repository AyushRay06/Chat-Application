import express, { Router } from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js"

const router = Router()

router.get("/user", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessages)
router.post("/send/:id", protectedRoute, sendMessage)
export default router
