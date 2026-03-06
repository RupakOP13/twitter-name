import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
  


const useFollow = () => {

    const queryClient = useQueryClient();

const {mutate:follow,isPending}= useMutation({
    mutationFn: async(userId) => {
        try {
            const res = await fetch(`/api/users/follow/${userId}`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({userId})
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message || "Failed to follow user");
            return data;
        } catch(err) {
            console.log(err);
            throw err;
        }
    },
    onSuccess: () => {
        Promise.all([
            queryClient.invalidateQueries(["suggestedUsers"]),
            queryClient.invalidateQueries(["authUser"])
        ]);
        
    },
    onError: (err) => {
        toast.error(err.message || "Failed to follow user");
    }

}
);
return {follow,isPending};
}




export default useFollow;