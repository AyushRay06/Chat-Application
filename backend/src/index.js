import express from "express"
import authRoutes from "../routes/auth.route.js"
import dotenv from "dotenv"
import { connectDb } from "../lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 5001

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  connectDb()
})
