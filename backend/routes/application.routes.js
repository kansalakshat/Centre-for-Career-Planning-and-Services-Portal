import express from "express";
import {
  getStudentApplications,
  applyToJob,
  cancelApplication,
  getJobApplications,
updateOnCampusApplicationStatus,
  getAppliedJobs, 
} from "../controllers/applications.controller.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/student-applications", protectRoute, getStudentApplications);
// FIX: Changed the route path from "/apply" to "/" to match the frontend request: POST /api/applications
router.post("/", protectRoute, applyToJob);
router.delete("/cancel/:jobId", protectRoute, authorizeRoles("admin"), cancelApplication);
router.get("/job/:jobId/applicants", protectRoute, authorizeRoles("admin"), getJobApplications);
router.get("/applied-jobs", protectRoute, getAppliedJobs);
// Removed the redundant/incorrect router.post('/', applicationsController.createApplication);

//updated the route for the oncampusApplication Status.
router.put(
  "/:applicationId/status", protectRoute, authorizeRoles("admin"),updateOnCampusApplicationStatus
);


export default router;
