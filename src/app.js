import dotenv from 'dotenv';
import express from 'express';
import smsRoutes from './routes/sms.routes.js'
import userRoutes from './routes/user.routes.js'
import rideRoutes from './routes/ride.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan' 
import passport from 'passport'




// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}



// Initialize Express application
const app = express();

app.use(cookieParser());

// Use Morgan for logging HTTP requests
app.use(morgan('dev'));


// Initialize Passport for authentication
app.use(passport.initialize());

//parsing data from form
app.use(express.urlencoded({ extended: true }));

//allow access from all origins 
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// To parse incoming JSON in POST request body
app.use(express.json({ limit: '2mb' }));

//SMS related routes
app.use('/api/sms', smsRoutes);

//user related routes
app.use('/api/auth', userRoutes);

//ride related routes
app.use('/api/ride', rideRoutes);

// Error handling middleware
app.use((err, res) => {
    // Extract status and message from the error object, defaulting to 500 and a generic message
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    // Log the error details to the console for debugging
    console.error(err);

    // Send the error response to the client
    res.status(status).json({ message });
});

export default app;