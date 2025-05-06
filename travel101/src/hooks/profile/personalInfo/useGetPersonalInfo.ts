import { getPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPersonalInfo = (uuid: string) => {
	return useQuery({
		queryKey: ["personal-Info", uuid],
		queryFn: async () => {
			const response = await getPersonalInfo(uuid);
			return response;
		},
		enabled: !!uuid,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
};