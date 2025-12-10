import express from 'express';
import { getAllCourses, getLecturesByCourseId } from '../controllers/course.controller.js';
const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getLecturesByCourseId)

export default router;