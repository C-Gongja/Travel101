'use client'

import { fetchDeleteTrip } from '@/api/trip/tripApi';
import { useTripStore } from '@/store/trip/trip-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useDeleteTrip = () => {
	const queryClient = useQueryClient();
	const { trip } = useTripStore();
	const router = useRouter();

	const mutation = useMutation<void, Error, string>({
		mutationFn: (tripUid: string) => fetchDeleteTrip(tripUid),
		onSuccess: () => {
			console.log("Trip deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ['trips'] });
			router.back();
		},
		onError: (error) => {
			console.error("Failed to delete trip:", error.message);
			// useMutation의 onError에서는 직접 에러를 던지지 않습니다.
			// error 상태가 자동으로 업데이트됩니다.
		},
	});

	// deleteTrip 함수가 mutation.mutateAsync()를 호출하도록 변경
	const deleteTrip = async () => { // async 키워드 추가
		if (!trip || !trip.tripUid) {
			// 이 경우, deleteTrip 자체가 에러를 던질 수 있도록 합니다.
			// 그러면 TripCustom에서 이를 try-catch로 잡을 수 있습니다.
			throw new Error("삭제할 여행 정보가 없습니다.");
		}
		// mutateAsync를 호출하고 Promise를 반환하도록 변경
		return mutation.mutateAsync(trip.tripUid);
	};

	return {
		deleteTrip, // 이제 deleteTrip 함수 자체가 Promise를 반환합니다.
		isLoading: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
};

export default useDeleteTrip;