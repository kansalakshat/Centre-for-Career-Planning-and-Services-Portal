import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  linkedin: {
    type: String,
  },
  InstituteId: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  batch: {
    type: Number, // year like 2020, 2021, etc.
    required: true,
  },
  jobs: [
    {
      id: { type: String, required: true },
      role: { type: String, required: true },
    },
  ],
});

const Alumni = mongoose.model("Alumni", alumniSchema);
alumniSchema.index({ company: 1 });
export default Alumni;
    