type locationType = {
    latitude: number,
    longitude: number
}

type fareRequestType = {
    location: locationType,
    destination: locationType
}

export type {locationType, fareRequestType};