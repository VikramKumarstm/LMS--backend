import Course from "../models/course.model.js"
import AppError from "../utils/error.utils.js";

const getAllCourses = async (req, res, next) => {
    try {

        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: 'All courses',
            courses
        })

    } catch (error) {

        return next(new AppError(error.message, 500));
        
    }

}

const getLecturesByCourseId = async (req, res, next) => {
    try {

        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course not found', 400))
        }

        res.status(200).json({
            success: true,
            message: 'Course lectures fetched successfully.',
            lectures: course.lectures
        });

    } catch (error) {
        
        return next(new AppError(error.message, 500));

    }
}

//Create course
const createCourse = async (req, res, next) => {

}

//update course
const updateCourse = async (req, res, next) => {

}

//Delete Course
const removeCourse = async (req, res, next) => {

}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse
}