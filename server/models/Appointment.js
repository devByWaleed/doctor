import mongoose from "mongoose"

// Creating doctor schema
const AppointmentSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    docID: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    // When appointment was added in database
    date: { type: Number, required: true },

    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})


// .model gets collection name & schema
const AppointmentModel = mongoose.models.appointment || mongoose.model("appointment", AppointmentSchema)


// Exporting the model
export default AppointmentModel