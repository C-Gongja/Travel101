import { fetchProfile } from "@/api/account/profile/profileApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProfile = (uuid: string) => {
	return useQuery({
		queryKey: ["profile", uuid],
		queryFn: async () => {
			const response = await fetchProfile(uuid);
			return response;
		},
		enabled: !!uuid,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
};