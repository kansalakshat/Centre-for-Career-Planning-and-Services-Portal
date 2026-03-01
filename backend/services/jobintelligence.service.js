import JobPosting from "../models/jobPosting.model.js";
import Alumni from "../models/Alumni.model.js";


export const getIntelligentFeed = async (user, queryParams) => {
    const {
        type,
        company,
        batch,
        skill,
        author,
        page = 1,
        limit = 10,
        sortBy,
        order
    } = queryParams;

    matchStage.$or = [
    { Expiry: { $gte: new Date() } },
    { Expiry: { $exists: false } },
    { Expiry: null }
    ];


    // Exact matches
    if (type) {
        if (!["on-campus", "off-campus"].includes(type)) {
            throw new Error("Invalid job type");
        }
        matchStage.Type = type;
    }

    if (batch) {
        const batchNum = Number(batch);
        if (isNaN(batchNum)) {
            throw new Error("Invalid batch");
        }
        matchStage.batch = batchNum;
    }

    if (author) {
        matchStage.author = author;
    }

    // Partial matches
    if (company) {
        const escapedCompany = company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchStage.Company = {
            $regex: escapedCompany,
            $options: "i"
        };
    }

    if (skill) {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchStage.requiredSkills = {
            $regex: `^${escapedSkill}$`,
            $options: "i"
        };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (
        Number.isNaN(pageNum) ||
        Number.isNaN(limitNum) ||
        pageNum < 1 ||
        limitNum < 1 ||
        limitNum > 50
    ) {
        throw new Error("Invalid pagination values");
    }

    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await JobPosting.countDocuments(matchStage);
    const totalPages = Math.ceil(totalJobs / limitNum);

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

    if (sortBy && sortBy !== "relevanceScore") {
        throw new Error("Invalid sort field");
    }

    if (order && !["asc", "desc"].includes(order)) {
        throw new Error("Invalid sort order");
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
            $sort: { _id: 1 }
        });
    }

    // pipeline.push({ $skip: skip });
    // pipeline.push({ $limit: limitNum });

    const jobPostings = await JobPosting.aggregate(pipeline);

    // ===== Alumni Aggregation Layer =====
    const companies = [
        ...new Set(jobPostings.map(j => j.Company?.toLowerCase().trim()))
    ];

    const alumniData = await Alumni.find({
        company: { $in: companies }
    }).select("name batch jobs company");

    const alumniGrouped = {};

    alumniData.forEach(alum => {
        const companyKey = alum.company?.toLowerCase().trim();

        if (!alumniGrouped[companyKey]) {
            alumniGrouped[companyKey] = [];
        }

        alumniGrouped[companyKey].push({
            name: alum.name,
            batch: alum.batch,
            roles: alum.jobs.map(j => j.role)
        });
    });

    // Eligibility Layer (Basic Version)
    const enrichedJobs = jobPostings.map(job => {

        const companyKey = job.Company?.toLowerCase().trim();
        const companyAlumni = alumniGrouped[companyKey] || [];

        const alumniCount = companyAlumni.length;
        const alumniList = companyAlumni;

        const now = new Date();
        let eligibilityStatus = "Eligible";
        let eligibilityReason = "Meets basic criteria";

        if (job.Expiry && new Date(job.Expiry) < now) {
            eligibilityStatus = "Not Eligible";
            eligibilityReason = "Job expired";
        }

        if (user?.batch && job.batch) {
            const jobBatches = Array.isArray(job.batch) ? job.batch : [job.batch];

            if (!jobBatches.includes(user.batch)) {
                eligibilityStatus = "Not Eligible";
                eligibilityReason = "Batch not eligible";
            }
        }

        let skillMatchScore = 0;

        if (user?.skills && job.requiredSkills?.length) {
            const userSkillsLower = user.skills.map(s => s.toLowerCase());
            const matches = job.requiredSkills.filter(skill =>
                userSkillsLower.includes(skill.toLowerCase())
            );

            skillMatchScore = matches.length / job.requiredSkills.length;
        }

        const daysRemaining = job.Deadline
            ? Math.max(0, (new Date(job.Deadline) - new Date()) / (1000 * 60 * 60 * 24))
            : 30;

        const freshnessWeight = 1 / (1 + daysRemaining);

        const eligibilityWeight = eligibilityStatus === "Eligible" ? 1 : 0;

        const priorityScore =
            eligibilityWeight * 5 +
            skillMatchScore * 3 +
            freshnessWeight * 2;

        const rankingReason = `
        EligibilityWeight: ${eligibilityWeight},
        SkillMatch: ${skillMatchScore.toFixed(2)},
        Freshness: ${freshnessWeight.toFixed(2)}
        `;
        


        return {
            ...job,
            eligibilityStatus,
            eligibilityReason,
            skillMatchScore,
            priorityScore,
            rankingReason,
            alumniCount,
            alumniList
        };
    });

    enrichedJobs.sort((a, b) => {
        return b.priorityScore - a.priorityScore;
    });
    const paginatedJobs = enrichedJobs.slice(skip, skip + limitNum);

    return {
        message: "Job postings retrieved successfully",
        page: pageNum,
        limit: limitNum,
        totalJobs,
        totalPages,
        jobs: paginatedJobs
    };
};
