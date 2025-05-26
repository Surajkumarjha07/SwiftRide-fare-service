import { EachMessagePayload } from "kafkajs";
import calculateFare from "../../utils/calculateFare.js";
import getLocationDetails from "../../utils/getLocationDetails.js";
import sendKafkaMessage from "../producers/sendKafkaMessage.js";
import generateRideId from "../../utils/generateRideId.js";

async function calculateFareHandler({ message }: EachMessagePayload) {
    try {
        const { userId, locationCoordinates, destinationCoordinates } = JSON.parse(message.value!.toString());

        if (!userId) throw new Error("Id not provided!");

        if (!locationCoordinates || !destinationCoordinates) throw new Error("locationCoordinates or destinationCoordinates not provided!");

        const fare: number = calculateFare(locationCoordinates, destinationCoordinates, "SUV");

        const { location, destination } = await getLocationDetails(locationCoordinates, destinationCoordinates);

        console.log(`fare from ${location} to ${destination} is: ${fare}`);

        const rideId: string = await generateRideId(30);

        console.log("generated rideId: " + rideId);

        await sendKafkaMessage("fare-fetched", { rideId, userId, pickUpLocation: location, destination, locationCoordinates, destinationCoordinates, fare });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error in calculate fare handler" + error.message);
        }
    }
}

export default calculateFareHandler;