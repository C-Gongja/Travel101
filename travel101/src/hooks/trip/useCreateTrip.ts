import { fetchCreateTrip } from '@/api/trip/tripApi';
import { Day, Trip } from '@/types/trip/tripStoreTypes';
import { useMutation } from '@tanstack/react-query';

const initializeDays = (startDate: Date, endDate: Date): Day[] => {
	const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	return Array.from({ length: dayCount }, (_, index) => ({
		number: index + 1,
		locations: [],
	}));
};

export const useCreateTrip = () => {
	return useMutation({
		mutationFn: async () => {
			const today = new Date();
			const defaultEndDate = new Date(today);
			defaultEndDate.setDate(today.getDate() + 2);

			const defaultTrip: Trip = {
				name: 'New Trip',
				startDate: today,
				endDate: defaultEndDate,
				days: initializeDays(today, defaultEndDate),
				scripted: 0,
				isCompleted: false,
				countries: [],
			};

			return await fetchCreateTrip(defaultTrip);
		},
	});
};
