import User from "../models/user.model.js"

//------GET ALL OTHER USERS FOR SIDEBAR------

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id
    //FIND ALL USERS EXCEPT THE LOGGED IN USER AND SELECT ALL FIELDS EXCEPT PASSWORD
    const filterdUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    )

    res.status(200).json(filterdUser)
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message)
    res.status(500).json({ message: "Server Error" })
  }
}
