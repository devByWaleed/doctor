import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import DoctorModel from "../models/Doctor.js"
import jwt from "jsonwebtoken"

// Add Doctor : /api/admin/add-doctor
export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

        const imageFile = req.file;

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email!"
            })
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a strong password!"
            })
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageURL = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
            image: imageURL
        }

        const newDoctor = new DoctorModel(doctorData)
        await newDoctor.save()

        return res.json({
            success: true,
            message: "Doctor added",
            doctorData
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}



// Add Doctor : /api/admin/login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            // To compare string with string
            const adminToken = jwt.sign(
                { data: email + password }, // Wrap in an object
                process.env.JWT_SECRET
            )

            return res.json({
                success: true,
                message: "Admin Logged In",
                adminToken: adminToken
            })
        }


        else {
            return res.json({
                success: false,
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// All Doctors List : /api/admin/all-doctors
export const allDoctors = async (req, res) => {
    try {
        const doctors = await DoctorModel.find({}).select("-password")
        return res.json({
            success: true,
            doctors
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


/*
http://localhost:4000/api/admin/add-doctor
*/