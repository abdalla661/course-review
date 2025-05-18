import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
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
    gradingFairness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    organization: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    availability: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    teachingQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
    commentStatus: {
       type: String,
       enum: ["pending", "approved", "rejected"],
       default: "pending",
}
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
