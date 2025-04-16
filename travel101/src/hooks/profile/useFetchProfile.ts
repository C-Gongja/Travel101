import { fetchProfile } from "@/api/profile/profileApi";
import { useProfileStore } from "@/store/user/user-profile-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchProfile = (uuid: string) => {
	return useQuery({
		queryKey: ["profile", uuid],
		queryFn: async () => {
			const response = await fetchProfile(uuid);
			console.log("profile: ", response);
			return response;
		},
		enabled: !!uuid,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
};