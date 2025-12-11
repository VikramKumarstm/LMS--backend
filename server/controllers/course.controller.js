import Course from "../models/course.model.js"
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises"

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

    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError('All fields are required.', 400));
    }

    try {

        const course = await Course.create({
            title,
            description,
            category,
            createdBy
        })
        
        if (!course) {
            return next(new AppError('Course could not be created, Please try again', 400))
        }

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms"
            });

            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`);
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course created successfully',
            data: course
        })

    } catch (error) {
        return next(new AppError(error.message, 500))
    }

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