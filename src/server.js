import app from "./app.js";
import connectDb from "./config/db.js";
import { createServer } from "http"; // Import http module
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;

// Connect to the database
connectDb();

// Create an HTTP server and attach it to Express
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend to connect (for now)
  },
});

const onlineDrivers = {}; // Track only online drivers

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Step 1: Identify user by role
  socket.on("set_user", ({ id, role }) => {
    console.log(`User ${id} connected as ${role}`);

    if (role === "driver") {
      onlineDrivers[socket.id] = { id };
      console.log("Driver online:", id);
    }
  });

  // Step 2: Passenger books a ride
  socket.on("book_ride", (rideData) => {
    console.log("New ride booked:", rideData);

    // Send request to all online drivers
    Object.keys(onlineDrivers).forEach((driverSocketId) => {
      io.to(driverSocketId).emit("new_ride_request", {
        ...rideData,
        rideId: socket.id,
      });
    });
  });

  // Step 3: Driver accepts the ride
  socket.on("accept_ride", (acceptData) => {
    console.log("Ride accepted by:", acceptData.driverId);

    // Notify the passenger
    io.to(acceptData.rideId).emit("ride_accepted", acceptData);

    // Notify other drivers that the ride is taken
    Object.keys(onlineDrivers).forEach((driverSocketId) => {
      io.to(driverSocketId).emit("ride_taken", { rideId: acceptData.rideId });
    });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Shuttle link server is running on http://localhost:${PORT}`);
});