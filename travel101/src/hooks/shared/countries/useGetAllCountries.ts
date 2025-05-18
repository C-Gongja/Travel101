import { getAllCountries } from "@/api/shared/country/CountryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllCountries = () => {
	return useQuery({
		queryKey: ["countries"],
		queryFn: async () => {
			const response = await getAllCountries();
			return response;
		},
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
};