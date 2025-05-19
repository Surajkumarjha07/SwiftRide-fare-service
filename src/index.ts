import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { fareRequestType } from "./types/faretypes.js";
import calculateFare from "./utils/calculateFare.js";

const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Fare service is running!");
});

app.post("/calculate-fare", (req: Request<{}, {}, fareRequestType>, res: Response) => {
    const { location, destination } = req.body;
    
    if(!location || !destination) throw new Error("location or destination not provided!");

    let fare = calculateFare(location, destination, "SUV");  
    
    res.status(200).json({
        message: `fare fetched: ${fare.toFixed(0)} rs.`
    })

})

app.listen(process.env.PORT, () => {
    console.log("Fare service is running!");
});