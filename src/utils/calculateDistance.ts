import { getPreciseDistance, convertDistance } from "geolib";
import { locationType } from "../types/faretypes.js";

function calculateDistance(locationCoordinates: locationType, destinationCoordinates: locationType): number {
    const distance = getPreciseDistance(
        { latitude: locationCoordinates.latitude, longitude: locationCoordinates.longitude },
        { latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude }
    );

    const distanceKm = convertDistance(distance, "km");

    return distanceKm;
}

export default calculateDistance;