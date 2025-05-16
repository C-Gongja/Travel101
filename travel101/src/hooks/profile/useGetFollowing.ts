import { getAllFollowing } from "@/api/account/follow/FollowApi";
import { useQuery } from "@tanstack/react-query";

const useGetFollowing = (uuid: string) => {
	return useQuery({
		queryKey: ["following", uuid],
		queryFn: async () => {
			const response = await getAllFollowing(uuid);
			console.log("userTrips: ", response);
			return response;
		},
		enabled: !!uuid,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: true,
	});
}

export { useGetFollowing };