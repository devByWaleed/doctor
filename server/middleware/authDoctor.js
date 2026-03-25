import jwt from "jsonwebtoken"


const authDoctor = async (req, res, next) => {
    try {
        // Getting token. Headers are lowercase
        const doctorToken = req.headers["doctortoken"];


        if (!doctorToken) {
            return res.json({ success: false, message: "Not Authorized. Login Again" })
        }

        // Verifying token
        const tokenDecode = jwt.verify(doctorToken, process.env.JWT_SECRET)
        req.doctorID = tokenDecode.id
        next()
    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;