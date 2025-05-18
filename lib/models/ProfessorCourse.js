import mongoose from "mongoose";

const ProfessorCourseSchema = new mongoose.Schema(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: prevent duplicate assignments
ProfessorCourseSchema.index({ course: 1, professor: 1 }, { unique: true });

export default mongoose.models.ProfessorCourse ||
  mongoose.model("ProfessorCourse", ProfessorCourseSchema);
