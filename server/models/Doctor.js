import mongoose from "mongoose"

// Creating doctor schema
const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    
    // When doctor was added in database
    date: { type: Number, required: true },

    // Stores booked slots
    slots_booked: { type: Object, default: {} },

    // For using empty object as default
}, { minimize: false })


// .model gets collection name & schema
const DoctorModel = mongoose.models.doctor || mongoose.model("doctor", DoctorSchema)


// Exporting the model
export default DoctorModel