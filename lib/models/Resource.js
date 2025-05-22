import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    combo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessorCourse",
      required: true,
    },
    tag: {
      type: String,
      enum: ["notes", "past_exams"],
      required: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
