// src/index.ts
import express from "express";
import dotenv from "dotenv";

// src/kafka/kafkaClient.ts
import { Kafka, logLevel } from "kafkajs";
var kafka = new Kafka({
  clientId: "fare-service",
  brokers: ["localhost:9092"],
  connectionTimeout: 1e4,
  requestTimeout: 3e4,
  retry: {
    initialRetryTime: 2e3,
    retries: 10
  },
  logLevel: logLevel.ERROR
});
var kafkaClient_default = kafka;

// src/kafka/consumerInIt.ts
var calculate_fare_consumer = kafkaClient_default.consumer({ groupId: "calculate-fare-group" });
async function consumerInIt() {
  await Promise.all([
    calculate_fare_consumer.connect()
  ]);
}

// src/utils/calculateDistance.ts
import { getPreciseDistance, convertDistance } from "geolib";
function calculateDistance(locationCoordinates, destinationCoordinates) {
  const distance = getPreciseDistance(
    { latitude: locationCoordinates.latitude, longitude: locationCoordinates.longitude },
    { latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude }
  );
  const distanceKm = convertDistance(distance, "km");
  return distanceKm;
}
var calculateDistance_default = calculateDistance;

// src/config/rates.ts
var rates = {
  bike: {
    basePay: 30,
    perKmRate: 10
  },
  car: {
    basePay: 50,
    perKmRate: 15
  },
  SUV: {
    basePay: 70,
    perKmRate: 20
  }
};
var rates_default = rates;

// src/utils/calculateFare.ts
function calculateFare(locationCoordinates, destinationCoordinates) {
  const distance = calculateDistance_default(locationCoordinates, destinationCoordinates);
  let fare = /* @__PURE__ */ new Map();
  for (const vehicle of Object.keys(rates_default)) {
    const basePay = rates_default[vehicle].basePay;
    const perKmRate = rates_default[vehicle].perKmRate;
    const price = Math.round(basePay + distance * perKmRate);
    fare.set(vehicle, price);
  }
  return fare;
}
var calculateFare_default = calculateFare;

// src/kafka/producerInIt.ts
import { Partitioners } from "kafkajs";
var producer = kafkaClient_default.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
async function producerInit() {
  await producer.connect();
}

// src/kafka/producers/sendKafkaMessage.ts
async function sendKafkaMessage(topic, data) {
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
var sendKafkaMessage_default = sendKafkaMessage;

// src/utils/generateRideId.ts
async function generateRideId(length) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
  let rideId = "";
  for (let i = 0; i < length; i++) {
    let pos = Math.floor(Math.random() * alpha.length);
    rideId = rideId + alpha[pos];
  }
  return rideId;
}
var generateRideId_default = generateRideId;

// src/utils/getCoordinates.ts
import axios from "axios";
async function getCoordinates(location) {
  try {
    const locationResponse = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_IQ_ACCESS_TOKEN}&q=${location}&format=json&`);
    if (!Array.isArray(locationResponse.data) || locationResponse.data.length === 0) {
      throw new Error(`No coordinates found for location: ${location}`);
    }
    const { lat, lon } = locationResponse.data[0];
    const locationCoordinates = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    return locationCoordinates;
  } catch (error) {
    throw new Error("Error in getCoordinates function: " + error.message);
  }
}
var getCoordinates_default = getCoordinates;

// src/utils/getRideCoordinates.ts
async function getRideCoordinates(location, destination) {
  try {
    const [locationCoordinates, destinationCoordinates] = await Promise.all([
      getCoordinates_default(location),
      getCoordinates_default(destination)
    ]);
    return { locationCoordinates, destinationCoordinates };
  } catch (error) {
    throw new Error("Error in getRideCoordinates function: " + error.message);
  }
}
var getRideCoordinates_default = getRideCoordinates;

// src/kafka/handlers/calculateFareHandler.ts
async function calculateFareHandler({ message }) {
  try {
    const { userId, location, destination } = JSON.parse(message.value.toString());
    if (!userId) throw new Error("Id not provided!");
    if (!location || !destination) throw new Error("location or destination not provided!");
    const { locationCoordinates, destinationCoordinates } = await getRideCoordinates_default(location, destination);
    console.log("locCoord: ", locationCoordinates);
    const fare = calculateFare_default(locationCoordinates, destinationCoordinates);
    console.log(`fare from ${location} to ${destination} is: ${fare}`);
    const rideId = await generateRideId_default(30);
    console.log("generated rideId: " + rideId);
    const fareToSend = Object.fromEntries(fare);
    console.log("fare: ", fareToSend);
    await sendKafkaMessage_default("fare-fetched", { rideId, userId, pickUpLocation: location, destination, locationCoordinates, destinationCoordinates, fare: fareToSend });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error in calculate fare handler: " + error.message);
    }
  }
}
var calculateFareHandler_default = calculateFareHandler;

// src/kafka/consumers/calculateFareConsumer.ts
async function calculateFareConsumer() {
  try {
    await calculate_fare_consumer.subscribe({ topic: "calculate-fare", fromBeginning: true });
    await calculate_fare_consumer.run({
      eachMessage: calculateFareHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error in getting calculate-fare request: " + error.message);
    }
  }
}
var calculateFareConsumer_default = calculateFareConsumer;

// src/kafka/kafkaAdmin.ts
async function kafkaInIt() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["calculate-fare"];
  const existingTopics = await admin.listTopics();
  const topicsToCreate = topics.filter((t) => !existingTopics.includes(t));
  if (topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate.map((t) => ({ topic: t, numPartitions: 1 }))
    });
  }
  console.log("Topics created!");
  await admin.disconnect();
}
var kafkaAdmin_default = kafkaInIt;

// src/kafka/index.ts
var startKafka = async () => {
  try {
    await kafkaAdmin_default();
    console.log("Consumer initialization...");
    await consumerInIt();
    console.log("Consumer initialized...");
    console.log("Producer initialization...");
    await producerInit();
    console.log("Producer initializated");
    await calculateFareConsumer_default();
  } catch (error) {
    console.log("error in initializing kafka: ", error);
  }
};
var kafka_default = startKafka;

// src/index.ts
var app = express();
dotenv.config();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Fare service is running!");
});
kafka_default();
app.listen(process.env.PORT, () => {
  console.log("Fare service is running!");
});
