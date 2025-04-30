import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a faculty name'],
      trim: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
