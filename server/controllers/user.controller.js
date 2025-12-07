import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";

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