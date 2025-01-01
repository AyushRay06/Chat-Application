import { p } from "framer-motion/client"
import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days  in milliseconds
    httpOnly: true, //prevents the cookie from being accessed by client-side scripts
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  })

  return token
}