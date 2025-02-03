import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const rideSchema = new Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    pickupLocation: {
        type: String,
        required: true,
        trim: true
    },
    dropoffLocation: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed'],
        default: 'pending'
    },
    fare: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const Ride = mongoose.model('Ride', rideSchema);