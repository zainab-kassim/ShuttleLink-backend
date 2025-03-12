import { Ride } from "../models/ride.model.js";
import { User } from "../models/user.model.js";
import { getIo, getOnlineDrivers, getOnlinePassengers } from "../socket.js"; // Import Socket functions


export const bookRide = async (req, res) => {
    try {
        const userId = req.user._id;
        const { pickupLocation, destination } = req.body;


        // Check if passenger exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }


        // Create a new ride
        const ride = new Ride({
            passenger: userId,
            pickupLocation,
            destination,
            status: "pending",
        });


        await ride.save();

        // Retrieve the ride with populated passenger details
        const populatedRide = await Ride.findById(ride._id).populate("passenger");


        // ✅ Get all online driver
        const onlineDrivers = getOnlineDrivers();
        const io = getIo();




        // ✅ Notify online drivers about new ride
        Object.keys(onlineDrivers).forEach((driverSocketId) => {
            io.to(driverSocketId).emit("new_ride_request", populatedRide);
        });




        return res.status(201).json({
            message: "Ride booked successfully",
            rideId: ride._id,
        });


    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const acceptRide = async (req, res) => {
    try {
        const { rideId, userId, passengerId } = req.body


        const updatedRide = await Ride.findByIdAndUpdate(
            rideId, // Ride ID
            {
                status: "accepted",
                driver: userId
            }, { new: true }
        ).populate("driver passenger");

        const onlineDrivers = getOnlineDrivers();
        const onlinePassengers = getOnlinePassengers();
        const io = getIo();
        const passengerSocketId = Object.keys(onlinePassengers).find(socketId => onlinePassengers[socketId].id.toString() === passengerId.toString());
        const driverSocketId = Object.keys(onlineDrivers).find(socketId => onlineDrivers[socketId].id.toString() === userId.toString());

        console.log(`Ride ${updatedRide} accepted by Driver ${userId}`);
        console.log(driverSocketId, passengerSocketId)


        if (passengerSocketId) {
            io.to(passengerSocketId).emit("ride_accepted", updatedRide);
        }



        return res.status(201).json({
            message: "Ride accepted successfully",
            status: updatedRide.status,
            updatedRide
        });

    } catch (error) {
        console.log(error)
    }

};


