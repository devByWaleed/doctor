import express from "express"
import { getProfile, login, register, updateProfile, bookAppointment } from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../config/multer.js";

const userRouter = express.Router();

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)

export default userRouter