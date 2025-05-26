import kafka from "./kafkaClient.js";

const calculate_fare_consumer = kafka.consumer({ groupId: "calculate-fare-group" });

async function consumerInIt() {
    await Promise.all([
        calculate_fare_consumer.connect()
    ])
}

export { consumerInIt, calculate_fare_consumer };