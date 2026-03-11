import DoctorModel from "../models/Doctor.js";

// Change Doctor Availability : /api/admin/change-availability
export const changeAvailability = async (req, res) => {
    try {
        const { docID } = req.body

        const docData = await DoctorModel.findById(docID)
        console.log(docData);

        console.log(docData.available);
        console.log(!docData.available);

        // await DoctorModel.findByIdAndUpdate(docID, { available: !docData.available })
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
            message: doctors
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}