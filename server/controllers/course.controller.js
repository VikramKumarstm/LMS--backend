import Course from "../models/course.model.js"
import AppError from "../utils/error.utils.js";

const getAllCourses = async (req, res) => {
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
        
    } catch (error) {
        
        return next(new AppError(error.message, 500));

    }
}

export {
    getAllCourses,
    getLecturesByCourseId
}