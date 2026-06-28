import { consumerInIt } from "./consumerInIt.js";
import calculateFareConsumer from "./consumers/calculateFare.consumer.js";
import kafkaInIt from "./kafkaAdmin.js";
import { producerInit } from "./producerInIt.js";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function startKafka() {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await kafkaInIt();

            await consumerInIt();
            await producerInit();
            await calculateFareConsumer();

            console.log("Kafka initialized successfully.");
            return;
        } catch (err) {
            console.error(
                `Kafka initialization failed (attempt ${attempt}/${MAX_RETRIES})`
            );

            if (attempt === MAX_RETRIES) {
                console.error("Maximum retry attempts reached. Exiting...");
                throw err;
            }

            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}

export default startKafka;