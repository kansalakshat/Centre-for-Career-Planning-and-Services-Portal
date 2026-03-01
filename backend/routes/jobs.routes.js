import express from "express";
import { jobCreate,jobUpdate,jobRelevanceScoreUpvote,jobRelevanceScoreDownvote,jobDelete,jobList } from "../controllers/jobs.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createJobSchema, updateJobSchema } from "../validators/job.validator.js";
import { objectIdSchema } from "../validators/common.validator.js";
import { z } from "zod";

const router = express.Router();

const paramIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

router.post("/", protectRoute, authorizeRoles("admin"), validate(createJobSchema), jobCreate);
router.put("/:id", protectRoute, authorizeRoles("admin"), validate(updateJobSchema), jobUpdate);
router.delete("/:id", protectRoute, authorizeRoles("admin"), validate(paramIdSchema), jobDelete);
router.get('/', protectRoute, jobList);
router.get('/upvote/:id', protectRoute, validate(paramIdSchema), jobRelevanceScoreUpvote);
router.get('/downvote/:id', protectRoute, validate(paramIdSchema), jobRelevanceScoreDownvote);

export default router;