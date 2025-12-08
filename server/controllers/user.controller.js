import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: false
}

//register user
export const register = async (req, res, next) => {

    const { fullName, email, password } = req.body;

    //Validate input
    if(!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }

    // Check if user exists
    const userExists = await User.findOne({email});
    if(userExists) {
        return next(new AppError('User already exists.', 400))
    }

    try {

        //create user
        const user = await User.create({
            fullName,
            email,
            password,
            avatar : {
                public_id: email,
                secure_url: 'https://png.pngtree.com/thumb_back/fh260/background/20230411/pngtree-nature-forest-sun-ecology-image_2256183.jpg'
            }
        });

        if(!user) {
            return next(new AppError('User registration failed, please try again!', 400))
        }

        //TODO: File upload
        console.log('File Details > ', JSON.stringify(req.file));
        if(req.file) {
            
            try {

                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill',
                });

                if(result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    //Remove file from server
                    fs.rm(`uploads/${req.file.filename}`)
                }
                
            } catch (error) {

                return next(error || 'file not uploaded! please try again', 500)
                
            }
        }

        await user.save();

        user.password = undefined;

        //Generate token
        const token = await user.generateJWTToken();

        //set token into cookie
        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        })
        
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }

}

//login user
export const login = async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('All fields are required', 400))
    }

    try {

        const user = await User.findOne({
            email
        }).select('+password')

        if(!user || !user.comparePassword(password)) {
            return next(new AppError('Email or Password does not match.', 400))
        }

        //Generate token
        const token = await user.generateJWTToken()
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User loggedin successfully.',
            user
        })

        
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

//logout user
export const logout = async (req, res) => {

    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully.'
    })

}

//get user profile details
export const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        })
        
    } catch (error) {

        return next(new AppError('Failed to fetch user detail.', 500))
        
    }

}

//forgot password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400))
    }

    const user = await User.findOne({email});

    if (!user) {
        return next(new AppError('Email not registered', 400))
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log(resetPasswordURL);
    
    const subject = 'Reset Password'
    const message = `You can reset your password by clicking <a href=${resetPasswordURL} traget='_blank> Reset Your Password</a>\n If the above link does not work for some reason then the copy paste the link in new tab ${resetPasswordURL}.\nIf you have not requested this, kindly ignore.`
    try {

        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully.`
        })
        
    } catch (error) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();

        return next(new AppError(error.message, 500))
    }
}

//reset password
export const resetPassword = async (req, res) => {

}