import { getPreciseDistance, convertDistance } from "geolib";
import coord from "../types/coordinate.type.js";

function calculateDistance(locationCoordinates: coord, destinationCoordinates: coord): number {
    const distance = getPreciseDistance(
        { latitude: locationCoordinates.latitude, longitude: locationCoordinates.longitude },
        { latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude }
    );

    const distanceKm = convertDistance(distance, "km");

    return distanceKm;
}

export default calculateDistance;