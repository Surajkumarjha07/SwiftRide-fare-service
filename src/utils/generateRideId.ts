
async function generateRideId(length: number): Promise<string> {
    const alpha: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
    let rideId: string = '';

    for (let i = 0; i < length; i++) {
        let pos = Math.floor(Math.random() * alpha.length)
        rideId = rideId + alpha[pos];
    }

    return rideId;
}

export default generateRideId;