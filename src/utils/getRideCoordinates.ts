import coord from "../types/coordinate.type.js";
import getCoordinates from "./getCoordinates.js";

async function getRideCoordinates(location: string, destination: string): Promise<{ locationCoordinates: coord, destinationCoordinates: coord }> {
    try {
        const [locationCoordinates, destinationCoordinates] = await Promise.all([
            getCoordinates(location),
            getCoordinates(destination)
        ])
    
        return { locationCoordinates, destinationCoordinates };
    } catch (error) {
        throw new Error("Error in getRideCoordinates function: " + (error as Error).message);
    }
}

export default getRideCoordinates;