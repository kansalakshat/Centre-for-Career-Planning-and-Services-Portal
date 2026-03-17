import ConnectionRequest from "../models/ConnectionRequest.model.js";
import User from "../models/user.model.js";
import { CONNECTION_REQUEST_TEMPLATE } from "../assets/emailTemplates.js";
import { sendEmail } from "../utils/emails.js"; 
import Alumni from "../models/Alumni.model.js";

export const sendRequest = async (req, res) => {
  try {
    const { alumniId, purpose, message } = req.body;

    const alumni = await Alumni.findById(alumniId);
    
    if (!alumni) {
      return res.status(404).json({
        message: "Alumni not found"
      });
    }

    const existingRequest = await ConnectionRequest.findOne({
      studentId: req.user.id,
      alumniId
    });

    if (existingRequest) {
      if (existingRequest.status === "pending" || existingRequest.status === "accepted") {
        return res.status(400).json({
          message: "You already have an active or accepted request with this alumni"
        });
      }

      // If declined, allow retry up to 3 times
      if (existingRequest.status === "declined") {
        if (existingRequest.attempts >= 3) {
          return res.status(400).json({
            message: "You have reached the maximum number of connection attempts (3) for this alumni"
          });
        }
      }
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const requestCount = await ConnectionRequest.countDocuments({
      studentId: req.user.id,
      createdAt: { $gte: oneWeekAgo }
    });

    if (requestCount >= 5) {
      return res.status(400).json({
        message: "You can send only 5 connection requests per week"
      });
    }

    let request;
    if (existingRequest && existingRequest.status === "declined") {
      // Re-use the existing request but increment attempts
      existingRequest.status = "pending";
      existingRequest.attempts += 1;
      existingRequest.purpose = purpose;
      existingRequest.message = message;
      request = await existingRequest.save();
    } else {
      // Create new request
      request = await ConnectionRequest.create({
        studentId: req.user.id,
        alumniId,
        purpose,
        message,
      });
    }

    // Fetch student and alumni--0
    const student = await User.findById(req.user.id);


    if (alumni?.Email) {
      const htmlContent = CONNECTION_REQUEST_TEMPLATE
        .replace("{studentName}", student.name)
        .replace("{purpose}", purpose)
        .replace("{message}", message);

      await sendEmail({
        to: alumni.Email,
        subject: "New Connection Request - CCPS Portal",
        html: htmlContent,
      });
    }

    res.status(201).json(request);

  } catch (err) {
    console.error("Error in sendRequest:", err);
    res.status(500).json({ message: "Error sending request" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      alumniId: req.user.id,
      status: "pending",
    }).populate("studentId", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await ConnectionRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Not found" });

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};

export const getMyRequests = async (req, res) => {
  try {

    const requests = await ConnectionRequest.find({
      studentId: req.user.id
    }).populate("alumniId", "name Email company");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: "Error fetching your requests" });
  }
};


export const getIncomingRequests = async (req, res) => {
  try {

    console.log("Logged in user:", req.userId);

    const user = await User.findById(req.userId);

    console.log("User email:", user.email);

    const alumniProfile = await Alumni.findOne({
      Email: user.email
    });

    if (!alumniProfile) {
      return res.status(404).json({
        message: "Alumni profile not found"
      });
    }

    console.log("Alumni profile id:", alumniProfile._id);

    const requests = await ConnectionRequest.find({
      alumniId: alumniProfile._id
    }).populate("studentId", "name email");

    console.log("Requests found:", requests);

    res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {

    console.error("Error fetching incoming requests:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

export const acceptRequest = async (req, res) => {
  try {

    const { requestId } = req.params;

    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request accepted"
    });

  } catch (error) {
    console.log("Accept request error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const declineRequest = async (req, res) => {
  try {

    const { requestId } = req.params;

    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.status = "declined";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request declined"
    });

  } catch (error) {

    console.log("Decline request error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};