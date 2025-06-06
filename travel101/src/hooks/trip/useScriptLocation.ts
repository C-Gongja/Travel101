import { tripScriptLocationApi } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store"
import { ScriptLocation } from "@/types/trip/tripScriptTypes";
import { Trip, TripResponse } from "@/types/trip/tripStoreTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useScriptLocation = () => {
	const queryClient = useQueryClient();

	const scriptTripLocationMutation = useMutation({
		mutationFn: tripScriptLocationApi,
		onSuccess: (data: TripResponse) => {
			console.log('Script trip success:', data);
		},
		onError: (error: Error) => {
			console.error('Script trip error:', error);
		},
	});

	return {
		scriptTripLocation: scriptTripLocationMutation.mutate,
		isSaving: scriptTripLocationMutation.isPending,
		error: scriptTripLocationMutation.error,
		isSuccess: scriptTripLocationMutation.isSuccess,
		data: scriptTripLocationMutation.data,
	};
};

export default useScriptLocation;