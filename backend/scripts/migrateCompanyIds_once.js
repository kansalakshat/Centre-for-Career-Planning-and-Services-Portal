import mongoose from "mongoose";
import dotenv from "dotenv";

import JobPosting from "../models/jobPosting.model.js";
import Alumni from "../models/Alumni.model.js";
import Company from "../models/company.model.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // ===== MIGRATE JOBS =====
    const jobs = await JobPosting.find();

    for (const job of jobs) {
      const normalized = job.Company?.trim().toLowerCase();
      if (!normalized) continue;

      let company = await Company.findOne({ name: normalized });

      if (!company) {
        company = await Company.create({ name: normalized });
      }

      await JobPosting.updateOne(
        { _id: job._id },
        { $set: { companyId: company._id } }
      );
    }

    console.log("Jobs migration done");

    // ===== MIGRATE ALUMNI =====
    const alumniList = await Alumni.find();

    for (const alum of alumniList) {
      const normalized = alum.company?.trim().toLowerCase();
      if (!normalized) continue;

      let company = await Company.findOne({ name: normalized });

      if (!company) {
        company = await Company.create({ name: normalized });
      }

      await Alumni.updateOne(
        { _id: alum._id },
        { $set: { companyId: company._id } }
      );
    }

    console.log("Alumni migration done");

    process.exit();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();