import express from "express";
import {protectRoute} from "../middlewares/protectRoute.js";
import {getUserProfile} from "../controllers/user.controller.js";
import {followUnfollowUser} from "../controllers/user.controller.js";


const router = express.Router();


router.get("/profile/:username",protectRoute,getUserProfile);
router.get("/suggested",getUserProfile);
router.post("/follow/:id",protectRoute,followUnfollowUser);
router.post("/update",protectRoute,updateUserProfile);