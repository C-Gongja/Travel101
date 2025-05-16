import { getAllFollowers } from "@/api/account/follow/FollowApi";
import { useQuery } from "@tanstack/react-query";

const useGetFollower = (uuid: string) => {
	return useQuery({
		queryKey: ["following", uuid],
		queryFn: async () => {
			const response = await getAllFollowers(uuid);
			console.log("userTrips: ", response);
			return response;
		},
		enabled: !!uuid,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: true,
	});
}

export { useGetFollower };