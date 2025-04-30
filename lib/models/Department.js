import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a department name'],
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
