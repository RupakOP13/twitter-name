import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config({ path: path.resolve("../.env") });


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // Add cookie-parser middleware

app.use(cors());


app.use("/api/auth",authRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
})
 

