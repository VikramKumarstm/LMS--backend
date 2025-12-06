import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";

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

        //TODO : File upload

        await user.save();

        user.password = undefined;

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

}

//logout user
export const logout = async (req, res) => {

}

//get user profile details
export const getProfile = async (req, res) => {

}