import UserModel from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"

// User registration : /api/user/register
export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }
        
        // Not valid email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid email!"
            })
        }
        
        // Not valid password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Enter a strong password!"
            })
        }

        // Check for user existance
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }

        // Hashing the password
         const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // const user = new UserModel({ name, email, password: hashedPassword })
        // await user.save();

        // Creating token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ 
            success: true,
            user: { email: user.email, name: user.name },
            token
        })
    }

    catch (error) {
        console.log(error.message);
        res.json({ 
            success: false,
            message: error.message 
        })
    }
}


// User login : /api/user/login
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and Password are required"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ 
            success: true, 
            user: { email: user.email, name: user.name } ,
            token
        })
    }

    catch (error) {
        console.log(error.message);
        return res.json({ 
            success: false, 
            message: error.message 
        })
    }
}