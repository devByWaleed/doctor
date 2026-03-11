import mongoose from "mongoose"
import profile from "../profile.js"


// Creating doctor schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: profile },
    address: { type: Object, default: { line1: "", line2: "" } },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
    phone: { type: String, default: "00000000000" },
})


// .model gets collection name & schema
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema)


// Exporting the model
export default UserModel