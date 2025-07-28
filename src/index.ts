import express, { Request, Response } from "express";
import dotenv from "dotenv";
import startKafka from "./kafka/index.kafka.js";

const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Fare service is running!");
});

// kafka setup
startKafka();

app.listen(process.env.PORT, () => {
    console.log("Fare service is running!");
});