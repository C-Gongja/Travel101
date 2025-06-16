import { fetchCreateTrip } from '@/api/trip/tripApi';
import { Day, Trip } from '@/types/trip/tripStoreTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useCreateTrip = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async () => {
			return await fetchCreateTrip();
		},
		onSuccess: ({ trip, editable, redirectUrl }) => {
			const createdTrip = {
				trip,
				editable, // editable 속성을 추가
			};
			queryClient.setQueryData(['trip', trip.uuid], createdTrip);
			console.log("redirectUrl: ", redirectUrl);
			router.push(redirectUrl);
		},
		onError: (error) => {
			console.log("create trip hook error: ", error);
		},
	});
};
