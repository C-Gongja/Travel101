import { fetchSaveTrip } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store";
import { Trip } from "@/types/trip/tripStoreTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSaveTrip = () => {
	const { trip, setTrip, setIsLoading } = useTripStore(); // Zustand store에서 값 가져오기
	const queryClient = useQueryClient(); // React Query 클라이언트 가져오기

	const saveTripMutation = useMutation({
		mutationFn: async (updatedTrip?: Trip) => {
			const tripToSave = updatedTrip || trip; // 전달된 trip이 없으면 기존 trip 사용
			console.log(tripToSave);
			if (!tripToSave?.uuid) {
				throw new Error("No trip provided or trip ID is missing");
			}

			const savedTrip = await fetchSaveTrip(tripToSave.uuid, tripToSave);
			return savedTrip;
		},
		onMutate: () => {
			setIsLoading(true); // 로딩 상태 활성화
		},
		onSuccess: (savedTrip: Trip) => {
			// Zustand 상태 업데이트
			const updatedTrip = {
				...savedTrip,
				startDate: new Date(savedTrip.startDate),
				endDate: new Date(savedTrip.endDate),
			};
			setTrip(updatedTrip);

			queryClient.setQueryData(['trip', savedTrip.uuid], {
				trip: updatedTrip,
				editable: true,
			});
		},
		onError: (error) => {
			console.error("Failed to update trip:", error);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		saveTrip: saveTripMutation.mutate, // 수정된 Trip을 인자로 받을 수 있음
		isSaving: saveTripMutation.isPending, // isLoading 대신 isPending 사용 (React Query 권장)
		error: saveTripMutation.error, 
	};
};

export default useSaveTrip;