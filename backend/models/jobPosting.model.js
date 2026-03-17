import mongoose from "mongoose";
import SavedJob from "./savedJobs.model.js";

const jobPostingSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true,
    },
    Company: {
        type: String,
        required: true,
    },
    requiredSkills: [{
        type: String,
    }],
    Type: {
        type: String,
        required: true,
        enum: ["on-campus", "off-campus"]
    },
    batch: {
        type: Number,
        required: true,
    },
    Deadline: {
        type: Date,
    },
    ApplicationLink: {
        type: String,
    },
    Expiry: {
        type: Date,
    },
    author: {
        type: String,
    },
    relevanceScore: {
        type: Number,
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    source: {
        type: String,
        default: "Internal"
    },
    externalId: {
        type: String,
    },
    originalLink: {
        type: String,
    },
    isScraped: {
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
    },
    salary: {
        type: String,
    }
});

// Middleware to cascade delete related SavedJobs when a JobPosting is deleted one-by-one (e.g., Admin UI)
jobPostingSchema.pre('findOneAndDelete', async function (next) {
    const job = await this.model.findOne(this.getQuery());
    if (job) {
        await SavedJob.deleteMany({ jobId: job._id });
    }
    next();
});

// Middleware to cascade delete related SavedJobs when multiple JobPostings are deleted (e.g., Scraper cron job)
jobPostingSchema.pre('deleteMany', async function (next) {
    // Attempting to delete many jobs
    // We get the query filter, e.g., { isScraped: true, createdAt: { $lt: ... } }
    // First, find all jobs that match this filter so we know their IDs
    const jobsToDelete = await this.model.find(this.getQuery());
    const jobIds = jobsToDelete.map(job => job._id);

    if (jobIds.length > 0) {
        await SavedJob.deleteMany({ jobId: { $in: jobIds } });
    }
    next();
});

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);

export default JobPosting;
