'use client'

import { fetchDeleteTrip } from '@/api/trip/tripApi';
import { useTripStore } from '@/store/trip/trip-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useDeleteTrip = () => {
	const { trip } = useTripStore();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const deleteTrip = async () => {
		if (!trip || !trip.tripUid) {
			console.error("No trip or trip ID available to update");
			return;
		}

		setIsLoading(true);
		try {
			await fetchDeleteTrip(trip.tripUid);
		} catch (error) {
			console.error("Failed to delete trip:", error);
		} finally {
			setIsLoading(false);
			router.back();
		}
	};

	return { deleteTrip, isLoading };
};

export default useDeleteTrip;
