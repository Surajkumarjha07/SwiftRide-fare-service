import calculateDistance from "./calculateDistance.js";
import rates from "../config/rates.js";
import coord from "../types/coordinate.type.js";

function calculateFare(locationCoordinates: coord, destinationCoordinates: coord): Map<string, number> {

    const distance: number = calculateDistance(locationCoordinates, destinationCoordinates);
    let fare: Map<string, number> = new Map();

    for (const vehicle of Object.keys(rates) as Array<keyof typeof rates>) {
        const basePay: number = rates[vehicle].basePay;
        const perKmRate: number = rates[vehicle].perKmRate;

        const price = Math.round(basePay + (distance * perKmRate));

        fare.set(vehicle, price);
    }

    return fare;

}

export default calculateFare;