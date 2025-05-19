import calculateDistance from "./calculateDistance.js";
import rates from "../config/rates.js";
import { locationType } from "../types/faretypes.js";
import { VehicleType } from "../types/vehicleType.js";

function calculateFare(location: locationType, destination: locationType, vehicle: VehicleType): number {
    const basePay = 50;
    let perKmRate = rates[vehicle].perKmRate || 0;

    const distance = calculateDistance(location, destination);

    const fare = basePay + (distance * perKmRate);

    return fare;

}

export default calculateFare;