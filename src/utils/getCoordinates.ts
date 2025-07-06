import axios from "axios";
import coord from "../types/coordinate.type.js";

async function getCoordinates(location: string): Promise<coord> {
    try {
        const locationResponse = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_IQ_ACCESS_TOKEN}&q=${location}&format=json&`)

        if (!Array.isArray(locationResponse.data) || locationResponse.data.length === 0) {
            throw new Error(`No coordinates found for location: ${location}`);
        }

        const { lat, lon } = locationResponse.data[0];

        const locationCoordinates: coord = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

        return locationCoordinates;

    } catch (error) {
        throw new Error("Error in getCoordinates function: " + (error as Error).message);
    }
}

export default getCoordinates;
