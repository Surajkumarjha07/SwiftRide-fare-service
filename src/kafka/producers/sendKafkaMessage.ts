import { producer } from "../producerInIt.js";

async function sendKafkaMessage(topic: string, data: {}) {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(data) }]
        });

        console.log(`${topic} sent`);

    } catch (error) {
        console.log(`error in sending ${topic}: ${error}`);
    }
}

export default sendKafkaMessage;
