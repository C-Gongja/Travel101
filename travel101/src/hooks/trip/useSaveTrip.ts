import { fetchCreateTrip, fetchSaveTrip } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store";
import { adaptTripModelToRequest, Trip, TripOwnerSnippet, TripResponse } from "@/types/trip/tripStoreTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type SaveTripMutationResult = {
	actionType: 'CREATE' | 'UPDATE';
	data: TripResponse; // fetchCreateTrip 또는 fetchSaveTrip의 실제 결과
};

const useSaveTrip = () => {
	const { trip, setTrip, setIsLoading } = useTripStore(); // Zustand store에서 값 가져오기
	const queryClient = useQueryClient(); // React Query 클라이언트 가져오기
	const router = useRouter();

	const saveTripMutation = useMutation<SaveTripMutationResult, Error, Trip | undefined>({
		mutationFn: async (updatedTrip?: Trip) => {
			const tripToSave = updatedTrip || trip; // 전달된 trip이 없으면 기존 trip 사용
			// console.log(tripToSave);
			if (!tripToSave?.tripUid) {
				throw new Error("No trip provided or trip ID is missing");
			}

			const requestUpdatedTrip = adaptTripModelToRequest(tripToSave);

			// const savedTrip = await fetchSaveTrip(tripToSave.tripUid, requestUpdatedTrip);
			// return savedTrip;

			// tripUid가 'temp-'로 시작하면 새로운 여행 생성 (POST)
			// 그렇지 않으면 기존 여행 업데이트 (PUT)
			if (tripToSave.tripUid.startsWith('temp-')) {
				// fetchCreateTrip 함수가 새로 생성된 Trip의 전체 정보를 반환해야 합니다 (실제 tripUid 포함)
				const newTrip = await fetchCreateTrip(requestUpdatedTrip); // POST 요청
				return { actionType: 'CREATE', data: newTrip };
			} else {
				const updatedTrip = await fetchSaveTrip(tripToSave.tripUid, requestUpdatedTrip); // PUT 요청
				return { actionType: 'UPDATE', data: updatedTrip };
			}
		},
		onMutate: () => {
			setIsLoading(true); // 로딩 상태 활성화
		},
		//여기 type 바꿔줘야함 
		onSuccess: (result) => {
			// console.log("saved new trip: ", result);
			const savedTrip = result.data;

			const updatedTrip = {
				...savedTrip.trip,
				startDate: new Date(savedTrip.trip.startDate),
				endDate: new Date(savedTrip.trip.endDate),
			};
			
			setTrip(updatedTrip);

			queryClient.setQueryData(['trip', savedTrip.trip.tripUid], {
				trip: updatedTrip,
				editable: true,
			});

			// 여기서 actionType을 확인하여 조건부 리디렉션을 수행합니다.
			if (result.actionType === 'CREATE') {
				if (savedTrip && savedTrip.trip.tripUid) {
					console.log("Redirecting after CREATE:", `trip/${savedTrip.trip.tripUid}`);
					router.push(`trip/${savedTrip.trip.tripUid}`);
				} else {
					// 이 경우는 거의 없겠지만, 만약을 위한 에러 처리
					throw new Error("Failed to get trip ID after creating new trip.");
				}
			} else {
				// actionType이 'UPDATE'인 경우, 리디렉션하지 않고 현재 페이지에 머무릅니다.
				console.log("Trip updated, staying on current page.");
			}
		},
		onError: (error) => {
			console.error("Failed to update trip:", error);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		saveTrip: saveTripMutation.mutateAsync, // 수정된 Trip을 인자로 받을 수 있음
		isSaving: saveTripMutation.isPending, // isLoading 대신 isPending 사용 (React Query 권장)
		error: saveTripMutation.error,
	};
};

export default useSaveTrip;