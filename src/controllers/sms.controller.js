// Import the required modules
import axios from 'axios';

// SMS sending function
export const sendSMS = async (req, res) => {

    try {
        // Extract data from the request body (e.g., phone number and message)
        const { to, username, destination } = req.body;
        console.log(to, username, destination)


        const sms = `Hello ${username},
Your shuttle booking with Shuttle Link is confirmed! 🚐
Details:

Pickup: Caleb University Gate
Destination: ${destination}
Date / Time: 25th January 2025, 10:00 AM
For inquiries or changes, reply to this SMS or contact us at +234-812-345-6789.
Thank you for choosing Shuttle Link!`;


       
        // Define the payload
        const data = {
            "from": "ShuttleLink",
            "type": "plain",
            "channel": "generic",
            "to": to, // Recipient's number in international format
            "sms": sms, // SMS message content
            "api_key": process.env.Termii_APIKEY, // Replace with your actual Termii API key
        };



        const response = await axios.post('https://v3.api.termii.com/api/sms/number/send', data, {
            headers: { 'Content-Type': 'application/json' },
        });
        res.status(200).json(response.data); // Automatic JSON parsing

    } catch (error) {
        // Log the error and return failure response to the client
        console.error("Error sending SMS:", error.message);
        res.status(500).json({ error: "Failed to send SMS", details: error.message });
    }
};


