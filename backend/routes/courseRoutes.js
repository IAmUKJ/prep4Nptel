import express from 'express';
import { getCourses,getCourseMaterials,getCourseAssignments } from '../controllers/courseController.js';
const router = express.Router();

router.get('/', getCourses);
// Route to get materials/details for a specific course by courseCode
router.get('/:courseCode', getCourseMaterials);
// New route for assignments only
router.get('/api/courses/:courseCode/assignments', getCourseAssignments);
export default router;
