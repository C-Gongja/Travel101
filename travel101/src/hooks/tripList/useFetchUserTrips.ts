import { fetchUserTrips } from "@/api/trip/tripListApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserTrips = (uuid: string) => {
	return useQuery({
		queryKey: ["userTrips", uuid],
		queryFn: async () => {
			const response = await fetchUserTrips(uuid);
			return response;
		},
		enabled: !!uuid,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
};