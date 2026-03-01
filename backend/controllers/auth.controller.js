import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";


export  const signup = async(req,res)=>{
    try {
        const {username,fullName,password,email} = req.body;

         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  //checks for valid email format
         if (!emailRegex.test(email)) {
             return res.status(400).json({message: "Invalid email format"});
         }
         const existingUser = await User.findOne({$or: [{email}, {username}]});
         if (existingUser) {
             return res.status(400).json({message: "Username or email already exists"});
         }

         //hash the password before saving to database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                fullName,
                password: hashedPassword,
                email
            });
            if(newUser){
                generateTokenAndSetCookie(newUser._id,res);
                await newUser.save();
                res.status(201).json({
                    _id: newUser._id,
                    username: newUser.username,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    followers: newUser.followers,
                    following: newUser.following,
                    profileImg: newUser.profileImg,
                    coverImg: newUser.coverImg,
                    bio: newUser.bio,
                    link: newUser.link,

                })
            }

    }
        catch (error) {
            console.error("Error during signup:", error);
            res.status(500).json({message: "Internal server error"});
        }
}

export const login = async(req,res)=>{
    try{
        const{username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({message: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id,res);
        //res has cookies set,it will set in request

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
    })
} catch(error){
    console.error("Error during login:", error);
    res.status(500).json({message: "Internal server error"});
}
}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"});
}
catch(error){
    console.error("Error during logout:", error);
    res.status(500).json({message: "Internal server error"});
}
};


export const getMe = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user);
    }
    catch(error){
        console.error("Error fetching user data:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

