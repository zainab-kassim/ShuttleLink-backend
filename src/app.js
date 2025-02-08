import dotenv from 'dotenv';
import express from 'express';
import smsRoutes from './routes/sms.routes.js'
import userRoutes from './routes/user.routes.js'
import cors from 'cors'


// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Initialize Express application
const app = express();

//parsing data from form
app.use(express.urlencoded({ extended: true }));

//allow access from all origins 
app.use(cors({ origin: "*", credentials: true }));

// To parse incoming JSON in POST request body
app.use(express.json({ limit: '2mb' }));

//SMS related routes
app.use('/api/sms', smsRoutes);

//SMS related routes
app.use('/api/auth', userRoutes);

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