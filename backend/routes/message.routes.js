import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Send message */
router.post(
  "/send",
  protectRoute,
  sendMessage
);

/* Get conversation */
router.get(
  "/:receiverId",
  protectRoute,
  getMessages
);

export default router;