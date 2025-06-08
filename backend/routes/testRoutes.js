// routes/testRoutes.js
import express from "express";
import { saveTestResult, getUserTestResults } from "../controllers/testController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // your JWT middleware

const router = express.Router();

router.post("/save", verifyToken, saveTestResult);
router.get("/user/:userId", verifyToken, getUserTestResults);

export default router;
