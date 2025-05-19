// src/index.ts
import express from "express";
import dotenv from "dotenv";

// src/utils/calculateDistance.ts
import { getPreciseDistance, convertDistance } from "geolib";
function calculateDistance(location, destination) {
  const distance = getPreciseDistance(
    { latitude: location.latitude, longitude: location.longitude },
    { latitude: destination.latitude, longitude: destination.longitude }
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
function calculateFare(location, destination, vehicle) {
  const basePay = 50;
  let perKmRate = rates_default[vehicle].perKmRate || 0;
  const distance = calculateDistance_default(location, destination);
  const fare = basePay + distance * perKmRate;
  return fare;
}
var calculateFare_default = calculateFare;

// src/index.ts
var app = express();
dotenv.config();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Fare service is running!");
});
app.post("/calculate-fare", (req, res) => {
  const { location, destination } = req.body;
  if (!location || !destination) throw new Error("location or destination not provided!");
  let fare = calculateFare_default(location, destination, "SUV");
  res.status(200).json({
    message: `fare fetched: ${fare.toFixed(0)} rs.`
  });
});
app.listen(process.env.PORT, () => {
  console.log("Fare service is running!");
});
