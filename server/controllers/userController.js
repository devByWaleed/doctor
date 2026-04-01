import UserModel from "../models/User.js";
import DoctorModel from "../models/Doctor.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import { v2 as cloudinary } from "cloudinary"
import AppointmentModel from "../models/Appointment.js";
import stripe from 'stripe';

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
            message: "Account created",
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
            message: "User logged in",
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
            message: "Profile Fetched",
            userData,
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
        await DoctorModel.findOneAndUpdate({ _id: docID }, { slots_booked })

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



// List appointment : /api/user/appointments
export const listAppointment = async (req, res) => {
    try {
        const userID = req.userID;
        const appointments = await AppointmentModel.find({ userID })
        return res.json({
            success: true,
            message: "Appointment fetched",
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


// Cancel appointment : /api/user/cancel-appointment
export const cancelAppointment = async (req, res) => {
    try {
        const userID = req.userID;
        const { appointmentID } = req.body
        const appointmentData = await AppointmentModel.findById(appointmentID)

        // Verify appointments user
        if (appointmentData.userID !== userID) {
            return res.json({
                success: false,
                message: "Unauthorized action"
            })
        }

        await AppointmentModel.findByIdAndUpdate(appointmentID, { cancelled: true })

        // Releasing doctor slot
        const { docID, slotDate, slotTime } = appointmentData

        const doctorData = await DoctorModel.findById(docID)

        // Filtering cancelled slots
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await DoctorModel.findByIdAndUpdate(docID, { slots_booked })

        return res.json({
            success: true,
            message: "Appointment cancelled"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}


const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;

        const appointmentData = await AppointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment not found or cancelled" });
        }

        // Create line items for Stripe
        const line_items = [{
            price_data: {
                currency: 'sgd', // or 'usd' / 'sgd'
                product_data: {
                    name: `Appointment with ${appointmentData.docData.name}`,
                    description: `Slot: ${appointmentData.slotDate} at ${appointmentData.slotTime}`
                },
                unit_amount: appointmentData.amount * 100, // Amount in cents
            },
            quantity: 1,
        }];

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/my-appointments?success=true`,
            cancel_url: `${origin}/my-appointments?success=false`,
            metadata: { appointmentId } // CRITICAL: This links the payment to the DB
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body MUST be the raw buffer (see Server Configuration below)
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`❌ Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { appointmentId } = session.metadata;

        try {
            await AppointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            await AppointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            console.log(`✅ Appointment ${appointmentId} updated to Paid and Completed.`);
        } catch (dbError) {
            console.error("❌ DB Update Failed:", dbError.message);
            return res.status(500).json({ success: false });
        }
    }

    res.status(200).json({ received: true });
};