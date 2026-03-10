import express from "express"
import upload from "../config/multer.js";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// Middleware for image processing
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor)

adminRouter.post("/login", loginAdmin)
adminRouter.get("/all-doctors", authAdmin, allDoctors)

export default adminRouter