import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.models.js";
import Post from "../models/post.model.js";
import User from "../models/user.models.js";


export const createPost = async(req,res)=>{
    try{
        const {text}=req.body;
        let {image}=req.body;
        const userId=req.user._id.toString();

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(!text && !image){
            return res.status(400).json({message: "Post cannot be empty"});

        }

        if(image){
            const uploadedResponse=await cloudinary.uploader.upload(image);
            image=uploadedResponse.secure_url;
        }

        const newPost=new Post({
            user:userId,
            text,
            image,
        });
        await newPost.save();
        res.status(201).json(newPost);
}
    catch(error){
        console.error("Error in createPost:", error);
        res.status(500).json({message: "Internal server error"});
    }
};


export const deletePost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        if(post.user.toString()!==req.user._id.toString()){
            return res.status(403).json({message: "You are not authorized to delete this post"});
        }
        if(post.image){
            const imgId=post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"});
    }
    catch(error){
        console.error("Error in deletePost:", error);
        res.status(500).json({message: "Internal server error"});

            


    }
}


export const commentOnPost=async(req,res)=>{
    try{
        const {text}=req.body;
        const postId=req.params.id;
        const userId=req.user._id;

        if(!text){
            return res.status(400).json({message: "Comment cannot be empty"});
        }
        const post=await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        const comment={user:userId,text};
        post.comments.push(comment);
        await post.save();
        res.status(201).json({message: "Comment added successfully"});
    }
    catch(error){
        console.error("Error in commentOnPost:", error);
        res.status(500).json({message: "Internal server error"});
    }
}


export const likeUnlikePost=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {id:postId}=req.params;

        const post =await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
const userLikedPost=post.likes.some((likeId)=>likeId.toString()===userId.toString());

if(userLikedPost){
    //  Unlike the post
    await Post.updateOne({_id:postId},{$pull:{likes:userId}});
    await User.updateOne({_id:userId},{$pull:{
        likedPosts:postId

    }});
    res.status(200).json({message: "Post unliked successfully"});
}  
else{
    // Like the post
    post.likes.push(userId);
    await User.updateOne({_id:userId},{$push:{
        likedPosts:postId
    }});
    await post.save();

    const notification=new Notification({
        from:userId,
        to:post.user,
        type:"like",
    });
    await notification.save();
    res.status(200).json({message: "Post liked successfully"});
}
   }
    catch(error){
        console.error("Error in likeUnlikePost:", error);
        res.status(500).json({message: "Internal server error"});
    }
};


export const getAllPosts=async(req,res)=>{
    try{
        const posts=await Post.find().sort({createdAt:-1}).populate({
            path:"user",  
            select:"-password"
        })
        .populate(
            {
                path:"comments.user",
                select:"-password"
            }
        )
        
        if(posts.length===0){
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }
    catch(error){
        console.error("Error in getAllPosts:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getLikedPosts=async(req,res)=>{
    const userId=req.params.id;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const likedPosts=await Post.find({
            _id:{$in:user.likedPosts}
        }).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        });
res.status(200).json(likedPosts);
    }
    catch(error){
        console.error("Error in getLikedPosts:", error);
        res.status(500).json({message: "Internal server error"});
    }
};


export const getFollowingPosts=async(req,res)=>{
    try{
        const userId=req.user._id;
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const following=user.following
        const feedPosts=await Post.find({
            user:{$in:following}
        }).sort({createdAt:-1}).populate({
            path:"user",  
            select:"-password"
        })
        .populate(
            {
                path:"comments.user",
                select:"-password"
            }
        );  
        res.status(200).json(feedPosts);    
    }

    catch(error){
        console.error("Error in getFollowingPosts:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getUserPosts=async(req,res)=>{
    try{
        const {username}=req.params;
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const posts=await Post.find({user:user._id}).sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({

            path:"comments.user",
            select:"-password"
        });
        res.status(200).json(posts);
    }
    catch(error){
        console.error("Error in getUserPosts:", error);
        res.status(500).json({message: "Internal server error"});
    }
};



    
