import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () =>
        console.log("Database Connected"));
        
        // URI with database name
        await mongoose.connect(`${process.env.MONGODB_URI}/doctor`);
    } catch (error) {
        console.error(error.message);   
    }
}

export default connectDB;