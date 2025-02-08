import {Ride} from '../models/ride.model.js'; // Import your Ride model
import {User} from '../models/user.model.js'; // Import User model if needed

export const bookRide = async (req, res) => {
    try {
        const userId= req.user._id
        const {  pickupLocation, destination } = req.body;

        // Check if the passenger and driver exist
        const UserExists = await User.findById(userId);
        

        if (!UserExists) {
            return res.status(404).json({ message: `${UserExists.role} not found`});
        }
        

        // Create a new ride
        const ride = new Ride({
            pickupLocation,
            destination,
        });

        await ride.save();

        return res.status(201).json({ message: "Ride created successfully", rideId: ride._id, status: ride.status });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
