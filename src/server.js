import app from "./app.js";
import connectDb from "./config/db.js";
import { createServer } from "http";
import { initializeSocket } from "./socket.js"; // Import socket setup


const PORT = process.env.PORT || 4000;


// Connect to the database
connectDb();


// Create HTTP server
const server = createServer(app);


// Initialize Socket.io
initializeSocket(server);


// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

