import { fetchGetTrip } from "@/api/trip/tripApi";
import { useUserStore } from "@/store/user/user-store";
import { useQuery } from "@tanstack/react-query";

export const useGetTrip = (tripUid: string) => {
	const { user, isAuthenticated } = useUserStore();

	return useQuery({
		queryKey: ["trip", tripUid],
		queryFn: async () => {
			const response = await fetchGetTrip({ tripUid: tripUid, isAuthenticated, user });
			console.log("trip: ", response);
			return response;
		},
		enabled: isAuthenticated !== null,
		staleTime: 1 * 60 * 1000,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};