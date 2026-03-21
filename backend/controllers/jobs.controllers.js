import { getIntelligentFeed } from "../services/jobintelligence.service.js";
import Company from "../models/company.model.js";


import JobPosting from '../models/jobPosting.model.js';
import mongoose from 'mongoose';

// Primary jobList handler — uses the Intelligent Feed service
export const jobList = async (req, res) => {
    try {
        const result = await getIntelligentFeed(req.user, req.query);
        res.status(200).json(result);
    } catch (error) {
    console.error("Error in jobList:", error);

    if (
        error.message.includes("Invalid job type") ||
        error.message.includes("Invalid batch") ||
        error.message.includes("Invalid pagination") ||
        error.message.includes("Invalid sort field") ||
        error.message.includes("Invalid sort order")
    ) {
        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
        message: "Internal server error"
    });
    }
};


export const jobCreate = async (req, res) => {
    try {
        const {
            jobTitle,
            jobDescription,
            Company: companyName,
            requiredSkills,
            Type,
            batch,
            Deadline,
            ApplicationLink,
            Expiry,
            author,
            relevanceScore
        } = req.body;
        // Create a new job posting instance
        const normalizedCompany = companyName.trim().toLowerCase();
        let companyDoc = await Company.findOne({ name: normalizedCompany });

        if (!companyDoc) {
            companyDoc = await Company.create({ name: normalizedCompany });
        }
        const newJobPosting = new JobPosting({
            jobTitle,
            jobDescription,
            Company: normalizedCompany,
            companyId: companyDoc._id,
            requiredSkills,
            Type,
            batch,
            Deadline,
            ApplicationLink,
            Expiry,
            author,
            relevanceScore
        });

        // Save the job posting to the database
        await newJobPosting.save();

        // Send a success response
        res.status(201).json({
            message: 'Job posting created successfully',
            job: newJobPosting
        });
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({
            message: 'Error creating job posting',
            error: error.message
        });
    }
};


export const jobUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };
        
        // Prevent client from overriding server-controlled fields
        delete updatedData.author;
        delete updatedData.relevanceScore;

        const updatedJobPosting = await JobPosting.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true // Ensure the updated data adheres to the schema
        });
        if (!updatedJobPosting) {
            return res.status(404).json({
                message: 'Job posting not found'
            });
        }
        res.status(200).json({
            message: 'Job posting updated successfully',
            job: updatedJobPosting
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating job posting',
            error: error.message
        });
    }
};



export const jobDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJobPosting = await JobPosting.findByIdAndDelete(id);
        if (!deletedJobPosting) {
            return res.status(404).json({
                message: 'Job posting not found'
            });
        }
        res.status(200).json({
            message: 'Job posting deleted successfully',
            job: deletedJobPosting
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting job posting',
            error: error.message
        });
    }
};

// Legacy jobList for admin — uses aggregation pipeline with applicationCount sorting
export const jobListLegacy = async (req, res) => {
    try {
        //Extracting query params
        const {
            type,
            company,
            batch,
            skill,
            author,
            page = 1,
            limit = 10,
            sortBy,
            order,
            source,
            isScraped,
            search
        } = req.query;

        const matchStage = {};

        if (search) {
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );
            matchStage.$or = [
                { Company: { $regex: escapedSearch, $options: "i" } },
                { jobTitle: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        // exact matches
        if (type) {
            if (!["on-campus", "off-campus"].includes(type)) {
                return res.status(400).json({ message: "Invalid job type" });
            }
            matchStage.Type = type;
        }

        if (source) {
            matchStage.source = source;
        }

        if (isScraped !== undefined) {
            matchStage.isScraped = isScraped === 'true';
        }

        if (batch) {
            const batchNum = Number(batch);
            if (isNaN(batchNum)) {
                return res.status(400).json({ message: "Invalid batch" });
            }
            matchStage.batch = batchNum;
        }

        if (author) {
            matchStage.author = author;
        }

        // partial matches
        if (company) {
            // escaping from regex characters
            const escapedCompany = company.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );
            matchStage.Company = {
                $regex: escapedCompany,
                $options: "i"
            };
        }


        if (skill) {
            const escapedSkill = skill.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );
            matchStage.requiredSkills = {
                $regex: `^${escapedSkill}$`,
                $options: "i"
            };
        }

        //Pagination validation
        const pageNum = Number(page);
        const limitNum = Number(limit);

        if (
            Number.isNaN(pageNum) ||
            Number.isNaN(limitNum) ||
            pageNum < 1 ||
            limitNum < 1 ||
            limitNum > 1000
        ) {
            return res.status(400).json({ message: "Invalid pagination values" });
        }

        const skip = (pageNum - 1) * limitNum;
        const totalJobs = await JobPosting.countDocuments(matchStage);
        const totalPages = Math.ceil(totalJobs / limitNum);


        //Build aggregation pipeline
        const pipeline = [];

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push({
            $lookup: {
                from: "jobapplications",
                localField: "_id",
                foreignField: "jobId",
                as: "jobApplications"
            }
        });

        // Compute application count for sorting
        pipeline.push({
            $addFields: {
                applicationCount: { $size: "$jobApplications" }
            }
        });

        //validation of sort if given
        const allowedSortFields = ["relevanceScore", "createdAt", "Deadline", "applicationCount"];
        if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: "Invalid sort field" });
        }

        if (order && !["asc", "desc"].includes(order)) {
            return res.status(400).json({ message: "Invalid sort order" });
        }
        if (sortBy === "relevanceScore") {
            pipeline.push({
                $sort: {
                    relevanceScore: order === "asc" ? 1 : -1,
                    _id: 1
                }
            });
        } else {
            pipeline.push({
                $sort: { applicationCount: -1, _id: -1 }
            });
        }


        // Pagination
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limitNum });

        //Execute query
        const jobPostings = await JobPosting.aggregate(pipeline);

        res.status(200).json({
            message: "Job postings retrieved successfully",
            page: pageNum,
            limit: limitNum,
            totalJobs,
            totalPages,
            jobs: jobPostings
        });

    } catch (error) {
        console.error("Error in jobListLegacy:", error);
        res.status(500).json({
            message: "Error retrieving job postings",
            error: error.message
        });
    }
};

// Helper function to check ObjectId validity
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Upvote a job posting
export const jobRelevanceScoreUpvote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });    
        }

        const jobPosting = await JobPosting.findById(id);
        if (!jobPosting) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        // Initialize fields if missing
        jobPosting.relevanceScore = jobPosting.relevanceScore || 0;
        jobPosting.upvotedBy = jobPosting.upvotedBy || [];
        jobPosting.downvotedBy = jobPosting.downvotedBy || [];

        const alreadyUpvoted = jobPosting.upvotedBy.some(voterId => voterId.toString() === userId.toString());
        const alreadyDownvoted = jobPosting.downvotedBy.some(voterId => voterId.toString() === userId.toString());

        if (alreadyUpvoted) {
            // Toggle off: remove upvote
            jobPosting.upvotedBy.pull(userId);
            jobPosting.relevanceScore -= 1;
        } else if (alreadyDownvoted) {
            // Switch from downvote to upvote
            jobPosting.downvotedBy.pull(userId);
            jobPosting.upvotedBy.push(userId);
            jobPosting.relevanceScore += 2;
        } else {
            // Normal upvote
            jobPosting.upvotedBy.push(userId);
            jobPosting.relevanceScore += 1;
        }

        await jobPosting.save();

        res.status(200).json({
            message: alreadyUpvoted ? 'Upvote removed' : 'Relevance score upvoted successfully',
            job: jobPosting,
            userVote: {
                upvoted: !alreadyUpvoted,
                downvoted: false
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating relevance score',
            error: error.message
        });
    }
};

// Downvote a job posting
export const jobRelevanceScoreDownvote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const jobPosting = await JobPosting.findById(id);
        if (!jobPosting) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        // Initialize fields if missing
        jobPosting.relevanceScore = jobPosting.relevanceScore || 0;
        jobPosting.upvotedBy = jobPosting.upvotedBy || [];
        jobPosting.downvotedBy = jobPosting.downvotedBy || [];

        const alreadyUpvoted = jobPosting.upvotedBy.some(voterId => voterId.toString() === userId.toString());
        const alreadyDownvoted = jobPosting.downvotedBy.some(voterId => voterId.toString() === userId.toString());

        if (alreadyDownvoted) {
            // Toggle off: remove downvote
            jobPosting.downvotedBy.pull(userId);
            jobPosting.relevanceScore += 1;
        } else if (alreadyUpvoted) {
            // Switch from upvote to downvote
            jobPosting.upvotedBy.pull(userId);
            jobPosting.downvotedBy.push(userId);
            jobPosting.relevanceScore -= 2;
        } else {
            // Normal downvote
            jobPosting.downvotedBy.push(userId);
            jobPosting.relevanceScore -= 1;
        }

        await jobPosting.save();

        res.status(200).json({
            message: alreadyDownvoted ? 'Downvote removed' : 'Relevance score downvoted successfully',
            job: jobPosting,
            userVote: {
                upvoted: false,
                downvoted: !alreadyDownvoted
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating relevance score',
            error: error.message
        });
    }
};
