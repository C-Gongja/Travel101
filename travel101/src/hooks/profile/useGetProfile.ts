import { fetchProfile } from "@/api/account/profile/profileApi";
import { useUserStore } from "@/store/user/user-store";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = (uuid: string) => {
	const { user, isAuthenticated } = useUserStore();

	return useQuery({
		queryKey: ["profile", uuid],
		queryFn: async () => {
			const response = await fetchProfile({ uuid, isAuthenticated, user });
			return response;
		},
		enabled: !!uuid && isAuthenticated !== null,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
};