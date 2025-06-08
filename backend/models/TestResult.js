// models/TestResult.js
import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  userAnswers: {
  type: Object, // ← change this
  required: true,
},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
