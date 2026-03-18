import Message from "../models/Message.model.js";
import ConnectionRequest from "../models/ConnectionRequest.model.js";
import User from "../models/user.model.js";
import Alumni from "../models/Alumni.model.js";

/* Send Message */
export const sendMessage = async (req, res) => {
  try {
    let senderId = req.user.id;
    const { receiverId, text } = req.body;

    const authUser = await User.findById(req.user.id);
    if(authUser.role === "alumni"){
      const alumniProfile = await Alumni.findOne({ Email: authUser.email });
      if(alumniProfile) senderId = alumniProfile._id.toString();
    }

    // Check if connection is accepted
    const connection = await ConnectionRequest.findOne({
      $or: [
        { studentId: senderId, alumniId: receiverId, status: "accepted" },
        { studentId: receiverId, alumniId: senderId, status: "accepted" }
      ]
    });

    if (!connection) {
      return res.status(403).json({
        message: "You can only message connected users"
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text
    });

    res.status(201).json(message);

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};


/* Get Conversation */
export const getMessages = async (req, res) => {
  try {

    let userId = req.user.id;
    const { receiverId } = req.params;

    const authUser = await User.findById(req.user.id);
    if(authUser.role === "alumni"){
      const alumniProfile = await Alumni.findOne({ Email: authUser.email });
      if(alumniProfile) userId = alumniProfile._id.toString();
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};