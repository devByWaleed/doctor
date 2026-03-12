import jwt from "jsonwebtoken"


const authUser = async (req, res, next) => {
    try {
        // Getting token. Headers are lowercase
        const userToken = req.headers["usertoken"];


        if (!userToken) {
            return res.json({ success: false, message: "Not Authorized. Login Again" })
        }

        // Verifying token
        const tokenDecode = jwt.verify(userToken, process.env.JWT_SECRET)
        req.userID = tokenDecode.id
        next()
    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default authUser;