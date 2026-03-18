import SavedJob from "../models/savedJobs.model.js";
import JobPosting from "../models/jobPosting.model.js";
import { getIntelligentFeed } from "../services/jobintelligence.service.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    await SavedJob.create({ userId, jobId });
    return res.status(200).json({ message: "Job saved." });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: "Already saved." });
    }
    console.error("Save job error:", err);
    return res.status(500).json({ message: "Failed to save job." });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedJobs = await SavedJob.find({ userId }).populate("jobId");

    const result = await getIntelligentFeed(req.user, {});
    const enrichedJobs = result.jobs;

    const enrichedSavedJobs = savedJobs.map((saved) => {
      const enriched = enrichedJobs.find(
        (job) => job._id.toString() === saved.jobId._id.toString()
      );

      return {
        ...saved.toObject(),
        jobId: enriched || saved.jobId
      };
    });

    res.json({ savedJobs: enrichedSavedJobs });

  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId; // set by protectRoute

    // Check if job exists (optional but good for validation)
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Remove from SavedJob collection
    const deleted = await SavedJob.findOneAndDelete({ userId, jobId });

    if (!deleted) {
      return res.status(404).json({ message: "Job was not saved." });
    }

    return res.status(200).json({
      message: "Job unsaved successfully.",
    });
  } catch (error) {
    console.error("Unsave job error:", error);
    return res.status(500).json({ message: "Failed to unsave job." });
  }
};
