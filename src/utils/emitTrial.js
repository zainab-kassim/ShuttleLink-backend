import { getIo, getOnlineDrivers, getOnlinePassengers } from "../socket.js"; // Import Socket functions

export function emitWithRetry(io, passengerId, data, attempts = 5, delay = 500) {
    let tries = 0;
    const sendEvent = () => {
        const onlinePassengers = getOnlinePassengers();
        const passengerSocketId = Object.keys(onlinePassengers).find(
            socketId => onlinePassengers[socketId].id.toString() === passengerId.toString()
        );

        if (passengerSocketId) {
            io.to(passengerSocketId).emit("ride_accepted", data);
            console.log("✅ Ride accepted event emitted to passenger:", passengerSocketId);
        } else if (tries < attempts) {
            tries++;
            console.log(`🔄 Retry ${tries}: Passenger socket not found yet...`);
            setTimeout(sendEvent, delay);
        } else {
            console.log("❌ Failed to find passenger socket after retries.");
        }
    };

    sendEvent();
}
