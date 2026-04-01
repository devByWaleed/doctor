import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/monogdb.js';
import adminRouter from './routes/adminRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import doctorRouter from './routes/doctorRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhooks } from './controllers/userController.js';


// Configuring server
const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

app.use(cors());

app.post('/api/user/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middleware configuration
app.use(express.json());


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));
app.use('/api/user', userRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/admin', adminRouter)


// Start server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});