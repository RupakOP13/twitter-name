import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({message: "Unauthorized"});
    }

    const user=await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(401).json({message: "Unauthorized"});
    }
    req.user=user;
    next();
}
catch(error){
    console.error("Error in protectRoute middleware:", error);
    if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
        return res.status(401).json({message: "Unauthorized"});
    }
    res.status(500).json({message: "Internal server error"});
}
}


