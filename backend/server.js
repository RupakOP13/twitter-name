import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.route.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import path from "path";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());  // Add cookie-parser middleware

app.use(cors({ origin: true, credentials: true }));


app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/users",userRoutes);
app.use("/api/notifications",notificationRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
})
 

