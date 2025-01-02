import bycrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudniary.js"

//---------Signup controller-------------------------------------

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
        //password: newUser.password,
        //token: generateToken(newUser._id),
      })
    }
  } catch (error) {
    console.log("Error: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}

//---------Login controller-------------------------------------

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    //CHECKING IF THE EMAIL AND PASSWORD ARE PROVIDED
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    //CHECKING IF THE USER EXISTS
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }
    //CHECKING IF THE PASSWORD IS CORRECT BY COMPARING THE GIVEN PASSWORD WITH THE HASHED PASSWORD
    const isPasswordCorrect = await bycrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }

    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      //password: user.password,
      //token: generateToken(user._id),
    })
  } catch (error) {
    console.log("Error in LOGIN!!!: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}
//---------Logout controller-------------------------------------
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in LOGOUT!!!: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}

//---------Update Profile Picture controller-------------------------------------

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" })
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findBtIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    console.log("Error in UPDATEPROFILE!!!: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}

//---------Check Auth controller-------------------------------------

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in CHECKAUTH!!!: ", error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}
