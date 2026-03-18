import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    attempts: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
export default ConnectionRequest;
