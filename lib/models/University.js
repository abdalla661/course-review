import mongoose from 'mongoose';

const UniversitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a university name'],
      unique: true,
      trim: true,
    },
    emailDomains: {
      type: [String],
      required: [true, 'Please add at least one email domain'],
      validate: {
        validator: (domains) => domains.length > 0,
        message: 'Please add at least one email domain',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.University || mongoose.model('University', UniversitySchema);
