import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";


export const getUserProfile=async(req,res)=>{
    const {username}=req.params;
    try{
        const user=await User.findOne({username}).select("-password")
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        console.error("Error fetching user profile:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const followUnfollowUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const userToModify=await User.findById(id);
        const currentUser=await User.findById(req.user._id);

        if(id===req.user._id.toString()){
            return res.status(400).json({message: "You cannot follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser){
            return res.status(404).json({message: "User not found"});
        }

        const isFollowing=currentUser.following.includes(id);

        if(isFollowing){
            // Unfollow the user
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
            res.status(200).json({message: "Unfollowed successfully"});
        }else{
            // Follow the user
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
            res.status(200).json({message: "Followed successfully"});

            const newNotification=new Notification({
                type:"follow",
                from:req.user._id,
                to:id,

        });
        await newNotification.save();
    }
}

    catch(error){
        console.error("Error in followUnfollowUser:", error);
        res.status(500).json({message: "Internal server error"});
    }
}


export const getSuggestedUsers=async(req,res)=>{
    try{
        const userId=req.user._id;
        const usersFollowedByMe=await User.findById(userId).select("following");

       const users=await User.aggregate([
        {
            $match:{
                _id:{$ne:userId},
            }
        }
        ,
        {
            $sample:{size:10}
        }
       ]);

       const filteredUsers=users.filter(user=>!usersFollowedByMe.following.includes(user._id));

       const suggestedUsers=filteredUsers.slice(0,4);
       suggestedUsers.forEach(user=>{
        user.password=null;
       });   // Remove password field before sending response

       res.status(200).json(suggestedUsers);
}
catch(error){
    console.error("Error fetching suggested users:", error);
    res.status(500).json({message: "Internal server error"});
}

}

