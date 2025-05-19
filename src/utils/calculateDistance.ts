import { getPreciseDistance, convertDistance } from "geolib";
import { locationType } from "../types/faretypes.js";

function calculateDistance(location: locationType, destination: locationType): number {
     const distance = getPreciseDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: destination.latitude, longitude: destination.longitude }
    );

    const distanceKm = convertDistance(distance, "km");

    return distanceKm;
}

export default calculateDistance;