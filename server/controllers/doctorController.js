import DoctorModel from "../models/Doctor.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import AppointmentModel from "../models/Appointment.js";

// Change Doctor Availability : /api/admin/change-availability
export const changeAvailability = async (req, res) => {
    try {
        const { docID } = req.body

        const docData = await DoctorModel.findById(docID)

        await DoctorModel.findByIdAndUpdate(docID, { available: !docData.available })
        return res.json({
            success: true,
            message: "Availability changed"
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}



// Get Doctors List : /api/doctor/list
export const doctorList = async (req, res) => {
    try {
        const doctors = await DoctorModel.find({}).select(["-email", "-password"])

        return res.json({
            success: true,
            message: "Doctors fetched successfully",
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


// Doctor login : /api/doctor/login
export const loginDoctor = async (req, res) => {

    try {
        const { email, password } = req.body;
        const doctor = await DoctorModel.findOne({ email })

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and Password are required"
            })
        }


        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const doctorToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            message: "Doctor logged in",
            doctorToken: doctorToken
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


// Doctor Appointments : /api/doctor/appointments
export const appointmentsDoctor = async (req, res) => {
    try {
        const docID = req.doctorID;
        const appointments = await AppointmentModel.find({ docID })

        res.json({
            success: true,
            message: "Appointments fetched",
            appointments
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Mark appointment completed : /api/doctor/complete-appointment
export const appointmentComplete = async (req, res) => {
    try {
        const docID = req.doctorID;
        const { appointmentId } = req.body;
        const appointmentData = await AppointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docID === docID) {
            await AppointmentModel.findByIdAndUpdate(appointmentId, {
                isCompleted: true
            })
            res.json({
                success: true,
                message: "Appointment Completed",
            })
        } else {
            res.json({
                success: false,
                message: "Mark Failed",
            })
        }

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Mark appointment cancel : /api/doctor/cancel-appointment
export const appointmentCancel = async (req, res) => {
    try {
        const docID = req.doctorID;
        const { appointmentId } = req.body;
        const appointmentData = await AppointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docID === docID) {
            await AppointmentModel.findByIdAndUpdate(appointmentId, {
                cancelled: true
            })
            res.json({
                success: true,
                message: "Appointment Cancelled",
            })
        } else {
            res.json({
                success: false,
                message: "Mark Failed",
            })
        }

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Dashboard data : /api/doctor/dashboard
export const doctorDashboard = async (req, res) => {
    try {
        const docID = req.doctorID;
        const appointments = await AppointmentModel.find({ docID })
        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userID)) {
                patients.push(item.userID)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        return res.json({
            success: true,
            dashData
        })

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Get profile data : /api/doctor/profile
export const doctorProfile = async (req, res) => {
    try {
        const docID = req.doctorID;
        const profileData = await DoctorModel.findById(docID).select("-password")

        return res.json({
            success: true,
            profileData
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Update profile data : /api/doctor/update-profile
export const updateDoctorProfile = async (req, res) => {
    try {
        const docID = req.doctorID;
        const { fees, address, available } = req.body;

        await DoctorModel.findByIdAndUpdate(docID, { fees, address, available })

        return res.json({
            success: true,
            message: "Profile Updated",
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}