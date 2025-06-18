import { tripScriptApi } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store"
import { Trip, TripResponse } from "@/types/trip/tripStoreTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useScriptTrip = () => {
	const { trip, setTrip } = useTripStore();
	const queryClient = useQueryClient();

	const scriptTripMutation = useMutation({
		mutationFn: tripScriptApi,
		onMutate: async (tripUid: string) => {
			console.log('Mutating script for trip:', tripUid);

			const queryKey = ['trip', tripUid];
			await queryClient.cancelQueries({ queryKey });

			// Get previous data from cache
			const previousTrip = queryClient.getQueryData<TripResponse>(queryKey);

			// Optimistic update
			if (trip && trip.tripUid === tripUid) {
				const updatedTrip = { ...trip, scripted: (trip.scripted || 0) + 1 };
				setTrip(updatedTrip);
				// Update cache with full response structure
				if (previousTrip) {
					queryClient.setQueryData(queryKey, {
						...previousTrip,
						trip: updatedTrip,
					});
				}
			}

			return { previousTrip, queryKey };
		},
		onSuccess: (data: TripResponse, tripUid: string, context: { previousTrip?: TripResponse; queryKey: string[] } | undefined) => {
			console.log('Script trip success:', data);

			if (trip && trip.tripUid === tripUid) {
				const updatedTrip = {
					...trip,
					scriptedCount: trip.scriptedCount + 1, // Handle scriptedCount
				};
				setTrip(updatedTrip);
				// Update cache
				if (context?.previousTrip) {
					queryClient.setQueryData(context.queryKey, {
						...context.previousTrip,
						trip: updatedTrip,
					});
				}
			}
		},
		onError: (error: Error, tripUid: string, context: { previousTrip?: TripResponse; queryKey: string[] } | undefined) => {
			console.error('Script trip error:', error);

			if (context?.previousTrip && trip && trip.tripUid === tripUid) {
				// Restore store with nested trip
				setTrip(context.previousTrip.trip);
				// Restore cache with full structure
				queryClient.setQueryData(context.queryKey, context.previousTrip);
			}
		},
	});

	return {
		scriptTrip: scriptTripMutation.mutateAsync,
		isSaving: scriptTripMutation.isPending,
		error: scriptTripMutation.error,
		isSuccess: scriptTripMutation.isSuccess,
		data: scriptTripMutation.data,
	};
};

export default useScriptTrip;