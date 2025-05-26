import { consumerInIt } from "./consumerInIt.js";
import calculateFareConsumer from "./consumers/calculateFareConsumer.js";
import kafkaInIt from "./kafkaAdmin.js";
import { producerInit } from "./producerInIt.js";

const startKafka = async () => {
    try {
        await kafkaInIt();

        console.log("Consumer initialization...");
        await consumerInIt();
        console.log("Consumer initialized...");

        console.log("Producer initialization...");
        await producerInit();
        console.log("Producer initializated");

        // Listening to incoming events
        await calculateFareConsumer();

    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

export default startKafka;