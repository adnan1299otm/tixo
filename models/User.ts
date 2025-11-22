
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  handle: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default' },
  
  // Enhanced Profile Fields
  bio: { type: String, default: '', maxlength: 150 },
  website: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Custom', 'Prefer not to say'], default: 'Prefer not to say' },
  birthday: { type: Date },
  
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
