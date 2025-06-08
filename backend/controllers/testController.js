// controllers/testController.js
import TestResult from "../models/TestResult.js";
import mongoose from "mongoose";
export const saveTestResult = async (req, res) => {
  try {
    console.log("User:", req.user); // check if user is present
    console.log("Body:", req.body); // log incoming data
    const { courseCode, weekNumber, score, total, userAnswers } = req.body;

    const newResult = new TestResult({
      userId: new mongoose.Types.ObjectId(req.user.id),
      courseCode,
      weekNumber,
      score,
      total,
      userAnswers,
    });

    await newResult.save();
    res.status(201).json({ message: "Test result saved", result: newResult });
  } catch (error) {
    res.status(500).json({ error: "Failed to save result" });
  }
};

export const getUserTestResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await TestResult.find({ userId }).sort({ timestamp: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
};
