import mongoose from "mongoose";

const ProfessorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Professor name is required"],
      
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Professor || mongoose.model("Professor", ProfessorSchema);
