import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectedRoute = async (req, res, next) => {
  try {
    //CHECKING IF THE COOKIE CONTAINS A TOKEN
    const token = req.cookies.jwt

    //IF THE TOKEN DOES NOT EXIST, THE USER IS NOT LOGGED IN
    if (!token) {
      return res.status(401).json({ message: "UNAUTHORIZED - No token found" })
    }
    //VERIFYING THE TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "UNAUTHORIZED - You are not authorized" })
    }

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    //IF THE USER EXISTS, WE PASS THE USER TO THE NEXT MIDDLEWARE
    req.user = user
    next()
  } catch (error) {
    console.log("Error in protectedRoute: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}
