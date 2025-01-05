import express from "express"
import authRoutes from "../routes/auth.route.js"
import messageRoutes from "../routes/message.route.js"
import dotenv from "dotenv"
import { connectDb } from "../lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
// This is the CORS configuration that allows the frontend to communicate with the backend.
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

const port = process.env.PORT || 5001

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  connectDb()
})
