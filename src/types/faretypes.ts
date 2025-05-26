type locationType = {
    latitude: number,
    longitude: number
}

type fareRequestType = {
    locationCoordinates: locationType,
    destinationCoordinates: locationType
}

export type {locationType, fareRequestType};