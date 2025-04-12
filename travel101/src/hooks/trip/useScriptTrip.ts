import { fetchScriptTrip } from "@/api/trip/tripApi";
import { useTripStore } from "@/store/trip/trip-store"
import { useState } from "react";

const useScriptTrip = () => {
	const { trip } = useTripStore();
	const [isLoading, setIsLoading] = useState(false);

	const scriptTrip = async () => {
		if (!trip || !trip.uuid) {
			console.error("No trip or trip ID available to script");
			return;
		}
		setIsLoading(true);

		try {
			await fetchScriptTrip(trip.uuid);
		} catch (e) {
			console.error("Failed to script trip:", e);
		} finally {
			setIsLoading(false);
		}

	};

	return { scriptTrip, isLoading }
}

export default useScriptTrip;