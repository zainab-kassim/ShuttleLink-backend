import { Server } from "socket.io";




let io;
const onlineDrivers = {}; // Store online drivers
const onlinePassengers ={}


export function initializeSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });


  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);


    // Set user role (Only store drivers)
    socket.on("set_user", ({ id, role }) => {
      console.log(`User ${id} connected as ${role}`);
      if (role === "driver") {
        onlineDrivers[socket.id] = { id };
        console.log("Driver online:", id);
      }else{
       onlinePassengers[socket.id]={id}
       console.log("passenger online: ", id)
      }
    });


    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      delete onlineDrivers[socket.id];
      delete onlinePassengers[socket.id]
    });
  });
}


// Function to get socket.io instance anywhere
export function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}


// Function to get online drivers anywhere
export function getOnlineDrivers() {
  return onlineDrivers;
}

// Function to get online drivers anywhere
export function getOnlinePassengers() {
  return onlinePassengers;
}
