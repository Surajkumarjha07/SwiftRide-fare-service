import { calculate_fare_consumer } from "../consumerInIt.js";
import calculateFareHandler from "../handlers/calculateFareHandler.js";

async function calculateFareConsumer() {
    try {
        await calculate_fare_consumer.subscribe({ topic: "calculate-fare", fromBeginning: true });
        await calculate_fare_consumer.run({
            eachMessage: calculateFareHandler
        })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error in getting calculate-fare request: " + error.message);
        }
    }
}

export default calculateFareConsumer;