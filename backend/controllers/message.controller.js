import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudniary.js"

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

//------GET MESSAGES BETWEEN LOGGED IN USER AND SELECTED USER------

export const getMessages = async (req, res) => {
  try {
    //GET THE ID OF THE USER TO CHAT WITH
    const { id: userToChatId } = req.params
    //GET THE ID OF THE LOGGED IN USER
    const myId = req.user._id

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    }) //.sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessages!!!", error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

//------SEND MESSAGE TO SELECTED USER------

export const sendMessage = async (req, res) => {
  try {
    //AS THE MESSAGE CAN BE TEXT OR IMAGE, WE WILL CHECK IF TEXT OR IMAGE IS PRESENT
    //RENAMING ID TO RECEIVERID TO MAKE IT MORE UNDERSTANDABLE
    //GET THE ID OF THE LOGGED IN USER

    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    //Just defining the imageUrl variable as it can be undefined
    let imageUrl
    if (image) {
      const uploadResponse = cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newMessage.save()

    //todo:realtime message sending

    res.status(200).json(newMessage)
  } catch (error) {
    console.log("Error in sendMessage!!!", error.message)
    res.status(500).json({ message: "Server Error" })
  }
}
