import express, { Router } from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { getUsersForSidebar } from "../controllers/message.controller.js"

const router = Router()

router.get("/user", protectedRoute, getUsersForSidebar)

export default router
