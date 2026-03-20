import express from "express";
import {sendRequest, getPendingRequests, updateRequestStatus, getMyRequests, getIncomingRequests, acceptRequest, declineRequest} from "../controllers/connect.controller.js";
import {protectRoute, authorizeRoles} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/request",
  protectRoute,
  authorizeRoles("student"),
  sendRequest
);

router.get(
  "/pending",
  protectRoute,
  authorizeRoles("alumni"),
  getPendingRequests
);

router.patch(
  "/:id/status",
  protectRoute,
  authorizeRoles("alumni"),
  updateRequestStatus
);

router.get(
  "/my-requests",
  protectRoute,
  authorizeRoles("student"),
  getMyRequests
);

router.get(
  "/incoming",
  protectRoute,
  authorizeRoles("alumni"),
  getIncomingRequests
);

router.put(
  "/accept/:requestId",
  protectRoute,
  authorizeRoles("alumni"),
  acceptRequest
);

router.put(
  "/decline/:requestId", 
  protectRoute, 
  authorizeRoles("alumni"),
  declineRequest
);

export default router;
