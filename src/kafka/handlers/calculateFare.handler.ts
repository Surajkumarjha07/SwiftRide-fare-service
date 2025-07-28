import { EachMessagePayload } from "kafkajs";
import calculateFare from "../../utils/calculateFare.js";
import sendKafkaMessage from "../producers/sendKafkaMessage.js";
import generateRideId from "../../utils/generateRideId.js";
import getRideCoordinates from "../../utils/getRideCoordinates.js";

async function calculateFareHandler({ message }: EachMessagePayload) {
    try {
        const { userId, location, destination } = JSON.parse(message.value!.toString());

        if (!userId) throw new Error("Id not provided!");

        if (!location || !destination) throw new Error("location or destination not provided!");
        
        const { locationCoordinates, destinationCoordinates } = await getRideCoordinates(location, destination);

        console.log("locCoord: ", locationCoordinates);
        
        const fare: Map<string, number> = calculateFare(locationCoordinates, destinationCoordinates);

        console.log(`fare from ${location} to ${destination} is: ${fare}`);

        const rideId: string = await generateRideId(30);

        console.log("generated rideId: " + rideId);

        const fareToSend = Object.fromEntries(fare);
        console.log("fare: ", fareToSend);
        
        await sendKafkaMessage("fare-fetched", { rideId, userId, pickUpLocation: location, destination, locationCoordinates, destinationCoordinates, fareDetails: fareToSend });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error in calculate fare handler: " + error.message);
        }
    }
}

export default calculateFareHandler;