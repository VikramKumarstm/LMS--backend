import express from 'express';
import { addLectureToCourseById, createCourse, deleteLectureToCourseById, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from '../controllers/course.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const router = express.Router();

router.route('/')
    .get(getAllCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse)
;

router.route('/:id')
    .get(isLoggedIn, authorizedRoles('ADMIN'), getLecturesByCourseId)
    .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), addLectureToCourseById)
;

router.delete('/:courseId/:lectureId', isLoggedIn, authorizedRoles('ADMIN'), deleteLectureToCourseById)

export default router;