import { fetchCloneTrips, fetchUserTrips } from "@/api/trip/tripListApi";
import { useQuery } from "@tanstack/react-query";

export const useGetCloneTripList = (uuid: string) => {
	return useQuery({
		queryKey: ["userTripsDays", uuid],
		queryFn: async () => {
			const response = await fetchCloneTrips(uuid);
			console.log("userTripsDays: ", response);
			return response;
		},
		enabled: !!uuid,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};