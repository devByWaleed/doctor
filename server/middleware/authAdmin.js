import jwt from "jsonwebtoken"


const authAdmin = async (req, res, next) => {
    try {
        // Getting token. Headers are lowercase
        const adminToken = req.headers["admintoken"];


        if (!adminToken) {
            return res.json({ success: false, message: "Not Authorized. Login Again" })
        }

        // Verifying token
        const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET)

        // Check the token data
        const expectedData = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

        // email + password, process.env.JWT_SECRET
        if (tokenDecode.data !== expectedData) {
            return res.json({ success: false, message: "Not Authorized. Login Again" })
        }

        next()
    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;