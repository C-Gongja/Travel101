import { tripScriptDayApi } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store"
import { TripResponse } from "@/types/trip/tripStoreTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useScriptDay = () => {
	const queryClient = useQueryClient();

	const scriptTripDayMutation = useMutation({
		mutationFn: tripScriptDayApi,
		onSuccess: (data: TripResponse) => {
			console.log('Script trip success:', data);
			// 필요하면 trip 목록 refetch
			// queryClient.invalidateQueries(['tripList']);
		},
		onError: (error: Error) => {
			console.error('Script trip error:', error);
		},
	});

	return {
		scriptTripDay: scriptTripDayMutation.mutate,
		isCloning: scriptTripDayMutation.isPending,
		error: scriptTripDayMutation.error,
		isSuccess: scriptTripDayMutation.isSuccess,
		data: scriptTripDayMutation.data,
	};
};

export default useScriptDay;