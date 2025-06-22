import calculateDistance from "./calculateDistance.js";
import rates from "../config/rates.js";
import { locationType } from "../types/fareRequesttype.js";
import { VehicleType } from "../types/vehicleType.js";

function calculateFare(locationCoordinates: locationType, destinationCoordinates: locationType, vehicle: VehicleType): number {
    const basePay: number = rates[vehicle].basePay;
    let perKmRate: number = rates[vehicle].perKmRate;

    const distance: number = calculateDistance(locationCoordinates, destinationCoordinates);

    const fare: number = basePay + (distance * perKmRate);

    return fare;

}

export default calculateFare;