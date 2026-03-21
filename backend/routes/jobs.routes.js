import express from "express";
import { jobCreate,jobUpdate,jobRelevanceScoreUpvote,jobRelevanceScoreDownvote,jobDelete,jobList,jobListLegacy } from "../controllers/jobs.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createJobSchema } from "../validators/job.validator.js";

const router = express.Router();

router.post("/", protectRoute, authorizeRoles("admin"), validate(createJobSchema), jobCreate);
router.put("/:id", protectRoute, authorizeRoles("admin"), jobUpdate);
router.delete("/:id", protectRoute, authorizeRoles("admin"), jobDelete);
router.get('/', protectRoute, jobList);
router.get('/admin', protectRoute, authorizeRoles("admin"), jobListLegacy);
router.get('/upvote/:id', protectRoute, jobRelevanceScoreUpvote);
router.get('/downvote/:id', protectRoute, jobRelevanceScoreDownvote);

export default router;