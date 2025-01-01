import bycrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"

export const signup = async (req, res) => {
  //Accuring the data from the request body

  const { email, fullName, password } = req.body
  try {
    //Email and Fullname validation
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    //PASSWORD LENGTH VALIDATION
    if (password.length < 6) {
      return res
        .status(400)
        .json({ messgae: "Password must be at least 6 characters" })
    }

    //Checking if the user already exists
    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ messgae: "user already exists" })
    }

    //hashing the Given password using bcrypt before saving it to the database
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)

    //Creating a new user and saving it to the database
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        //token: generateToken(newUser._id),
      })
    }
  } catch (error) {
    console.log("Error: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const login = (req, res) => {
  res.send("Hello from the auth route")
}

export const logout = (req, res) => {
  res.send("Hello from the Logout")
}
