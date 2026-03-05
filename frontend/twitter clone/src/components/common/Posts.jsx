import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";


const Posts = ({feedType}) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			default:
				return "/api/posts/all";
		}
	};
	const POSTS_ENDPOINT = getPostEndpoint();

	const {data:posts, isLoading,refetch,isRefetching} = useQuery({
		queryKey:["posts"],
		queryFn: async() => {
			try {
				const res = await fetch(POSTS_ENDPOINT);
				const data = await res.json();
				if(!res.ok) throw new Error(data.message || "Failed to fetch posts");
				return data;
			} catch(err) {
				console.log(err);
				throw err;
			}
		}
	});

	useEffect(()=>{
		refetch();
	},[feedType,refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;