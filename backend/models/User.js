import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
  testId: String,
  score: Number,
  attemptedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  testAttempts: [testAttemptSchema],
});

export default mongoose.model('User', userSchema);
