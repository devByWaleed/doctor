import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/monogdb.js';
import adminRouter from './routes/adminRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import doctorRouter from './routes/doctorRoutes.js';
import userRouter from './routes/userRoutes.js';


// Configuring server
const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Middleware configuration
app.use(express.json());
// app.use(cookieParser());
app.use(cors());


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));
app.use('/api/user', userRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/admin', adminRouter)


// Start server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});