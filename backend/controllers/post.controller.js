import User from "../models/user.model.js";

import Post from "../models/post.model.js";


export const createPost = async(req,res)=>{
    try{
        const {text}=req.body;
        let {imge}=req.body;
        const userId=req.user._id.toString();

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(!text && !imge){
            return res.status(400).json({message: "Post cannot be empty"});

        }

        if(imge){
            const uploadedResponse=await cloudinary.uploader.upload(imge);
            imge=uploadedResponse.secure_url;
        const newPost=new Post({
            user:userId,
            text,
            imge,
        });
        await newPost.save();
        res.status(201).json(newPost);
    }
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
        if(post.img){
            const imgId=post.img.split("/").pop().split(".")[0];
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
const userLikedPost=post.likes.includes(userId);

if(userLikedPost){
    //  Unlike the post
    await Post.updateOne({_id:postId},{$pull:{likes:userId}});
    res.status(200).json({message: "Post unliked successfully"});
}  
else{
    // Like the post
    post.likes.push(userId);
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
    
