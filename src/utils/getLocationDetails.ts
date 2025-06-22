import axios from "axios";
import { locationType } from "../types/fareRequesttype.js";

async function getLocationDetails(locationCoordinates: locationType, destinationCoordinates: locationType): Promise<{ location: string, destination: string }> {
    const locationResponse = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${process.env.LOCATION_IQ_ACCESS_TOKEN}&lat=${locationCoordinates.latitude}&lon=${locationCoordinates.longitude}&format=json`);

    const locationAddress = locationResponse.data.address;
    const location = locationAddress.road + ", " + locationAddress.suburb + ", " + locationAddress.city + ", " + locationAddress.state + ", " + locationAddress.postcode;

    const destinationResponse = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${process.env.LOCATION_IQ_ACCESS_TOKEN}&lat=${destinationCoordinates.latitude}&lon=${destinationCoordinates.longitude}&format=json`);

    const destinationAddress = destinationResponse.data.address;
    const destination = destinationAddress.road + ", " + destinationAddress.suburb + ", " + destinationAddress.city + ", " + destinationAddress.state + ", " + destinationAddress.postcode;

    return { location, destination };
};

export default getLocationDetails;