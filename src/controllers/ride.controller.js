import socketIo from 'socket.io';

const onlineDrivers = {}; // Store only online drivers

export const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Step 1: Identify user as a driver or passenger
        socket.on("identify", (userData) => {
            if (userData.role === "driver") {
                onlineDrivers[socket.id] = userData; // Add driver to online list
                console.log("Driver online:", userData);
            }
        });

        // Step 2: Passenger books a ride
        socket.on("book_ride", (rideData) => {
            console.log("New ride booked:", rideData);

            // Send ride request to all online drivers
            Object.keys(onlineDrivers).forEach((driverSocketId) => {
                io.to(driverSocketId).emit("new_ride_request", {
                    ...rideData,
                    rideId: socket.id, // Use passenger's socket ID as ride ID
                });
            });
        });

        // Step 3: Driver accepts a ride
        socket.on("accept_ride", (acceptData) => {
            console.log("Ride accepted by:", acceptData.driverId);

            // Notify the passenger
            io.to(acceptData.rideId).emit("ride_accepted", acceptData);

            // Notify other drivers that the ride is taken
            Object.keys(onlineDrivers).forEach((driverSocketId) => {
                io.to(driverSocketId).emit("ride_taken", { rideId: acceptData.rideId });
            });
        });

        // Step 4: When a driver disconnects, remove them from onlineDrivers
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            delete onlineDrivers[socket.id]; // Remove driver from online list
        });
    });

    return io;
};