import UserModel from "../models/User.js";
import DoctorModel from "../models/Doctor.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import { v2 as cloudinary } from "cloudinary"
import AppointmentModel from "../models/Appointment.js";

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

        const user = new UserModel({ name, email, password: hashedPassword })
        await user.save();

        // Creating token
        const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            user: { email: user.email, name: user.name },
            userToken: userToken
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

        const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            user: { email: user.email, name: user.name },
            userToken: userToken
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


// Get User Profile : /api/user/profile
export const getProfile = async (req, res) => {
    try {
        const userID = req.userID;
        const userData = await UserModel.findById(userID).select("-password")
        res.json({
            success: true,
            userData,
            // userToken: userToken
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



// Update User Profile : /api/user/profile
export const updateProfile = async (req, res) => {
    try {
        const userID = req.userID;
        const { name, phone, dob, gender, address } = req.body;
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({
                success: false,
                message: "Data Missing"
            })
        }

        await UserModel.findByIdAndUpdate(userID, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await UserModel.findByIdAndUpdate(userID, { image: imageURL })
        }
        return res.json({
            success: true,
            message: "Profile Updated"
        })

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Book appointment : /api/user/book-appointment
export const bookAppointment = async (req, res) => {
    try {
        const userID = req.userID;
        const { docID, slotDate, slotTime } = req.body;

        const docData = await DoctorModel.findById(docID).select("-password")

        if (!docData.available) {
            return res.json({
                success: false,
                message: "Doctor not available"
            })
        }

        let slots_booked = docData.slots_booked

        // Checking available slots
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: "Slot not available"
                })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await UserModel.findById(userID).select("-password")
        delete docData.slots_booked

        const appointmentData = {
            userID,
            docID,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new AppointmentModel(appointmentData)
        await newAppointment.save()

        // Save new slots data in docData
        await DoctorModel.findOneAndUpdate(docID, { slots_booked })

        return res.json({
            success: true,
            message: "Appointment booked"
        })

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}