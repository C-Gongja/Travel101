import { tripScriptApi } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store"
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useScriptTrip = () => {
	const { trip, setTrip } = useTripStore();
	const queryClient = useQueryClient();

	const scriptTripMutation = useMutation({
		mutationFn: tripScriptApi,
		onMutate: async (tripUid: string) => {
			console.log('Mutating script for trip:', tripUid);

			// 쿼리 취소
			const queryKey = ['trip', tripUid];
			await queryClient.cancelQueries({ queryKey });

			// 이전 데이터 저장
			const previousTrip = queryClient.getQueryData(queryKey);

			// 낙관적 업데이트: scriptedCount 증가
			if (trip && trip.tripUid === tripUid) {
				const updatedTrip = { ...trip, scripted: (trip.scripted || 0) + 1 };
				setTrip(updatedTrip);
				queryClient.setQueryData(queryKey, updatedTrip);
			}

			return { previousTrip, queryKey };
		},
		onSuccess: (data, tripUid, context) => {
			console.log('Script trip success:', data);
			// 서버 응답으로 trip 상태 업데이트
			if (data && trip && trip.tripUid === tripUid) {
				setTrip({ ...trip, scripted: data.scripted || (trip.scripted || 0) });
				queryClient.setQueryData(['trip', tripUid], { ...trip, scripted: data.scripted });
			}
			// 관련 쿼리 무효화 (선택적)
			// queryClient.invalidateQueries(['trip', tripUid]);
		},
		onError: (error, tripUid, context) => {
			console.error('Script trip error:', error);
			// 롤백: 이전 데이터 복원
			if (context?.previousTrip && context?.queryKey) {
				queryClient.setQueryData(context.queryKey, context.previousTrip);
				if (trip && trip.tripUid === tripUid) {
					setTrip(context.previousTrip);
				}
			}
		}
	});

	return {
		scriptTrip: scriptTripMutation.mutate,
		isSaving: scriptTripMutation.isPending,
		error: scriptTripMutation.error,
		isSuccess: scriptTripMutation.isSuccess,
		data: scriptTripMutation.data,
	};
}

export default useScriptTrip;