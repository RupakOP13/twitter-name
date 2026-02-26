import express from 'express';

const router = express.Router();

router.post('/create',protectRoute,createPost);
router.post('/like/:id',protectRoute,likeUnlikePost);
router.post('/comment/:id',protectRoute,commentOnPost);
router.delete('/:id',protectRoute,deletePost);


export default router;