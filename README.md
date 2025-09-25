💵 Fare Service

The Fare Service is an internal backend service of SwiftRide (Ride-Sharing platform), which is responsible for calculating fare between location to destination, according to different vehicle types.

-----------------------------------------------------------------------------------------------------------------------------------------------

🚀 Features

✅ Calculates coordinates of location and destination  
✅ Calculates fare between location to destination, according to different vehicle types (bike, car, SUV)  

-----------------------------------------------------------------------------------------------------------------------------------------------

🛠 Technologies Used

✅ Node.js    
✅ Express  
✅ TypeScript  
✅ Kafka  
✅ Docker  

-----------------------------------------------------------------------------------------------------------------------------------------------

📋 Prerequisites

Ensure you have the following installed ->  
Node.js (for JavaScript/TypeScript backend)  
Express 

Required Packages ->  
dotenv  
axios  
geolib  
prisma  
nodemon  
kafkajs  
tsup (for TypeScript)  
typescript (for TypeScript)  
concurrently (for TypeScript)  

Ensure you have the following tools running in your local machine ->  
Confluent Kafka Docker Image  
Redis Docker Image  

-----------------------------------------------------------------------------------------------------------------------------------------------

📌 Steps to Run

1️⃣ Clone the repository

git clone https://github.com/Surajkumarjha07/SwiftRide-fare-service.git

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file and configure the following variables ->  

PORT=your-port-number  
LOCATION_IQ_ACCESS_TOKEN=your-access-token  

4️⃣ Run the Application

nodemon index.js

🚀 Your Fare Service is now up and running! 🎉

