import { useTripStore } from "@/app/store/createTrip/trip-store";
import { apiClient } from "../apiClient";
import { Trip } from "@/types/tripStoreTypes";

const TRIP_BASE_URL = "http://localhost:8080/api/trip";
const TRIP_PUBLIC_URL = "http://localhost:8080/public/trip";

const fetchCreateTrip = async (trip: Trip): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_BASE_URL}/post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(trip)
		});

		return response;
	} catch (error) {
		console.error("Error fetching post trip:", error);
		return null;
	}
}

const fetchScriptTrip = async (tripUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_BASE_URL}/scriptTrip/${tripUuid}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response;
	} catch (error) {
		console.error("Error fetching post trip:", error);
		return null;
	}
}

const fetchGetTrip = async (tripUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_PUBLIC_URL}/${encodeURIComponent(tripUuid)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});
		return response;
	} catch (error) {
		console.error("Error fetching get trip:", error);
		return null;
	}
}

const fetchSaveTrip = async (tripUuid: string, updatedTrip: Trip): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_BASE_URL}/${encodeURIComponent(tripUuid)}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTrip),
		});

		return response;
	} catch (error) {
		console.error("Error fetching update trip:", error);
		return null;
	}
}

const fetchUpdateTrip = async (tripUuid: string, tripUpdates: Partial<Trip>): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_BASE_URL}/${encodeURIComponent(tripUuid)}`, {
			method: "PACTH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tripUpdates),
		});

		return response;
	} catch (error) {
		console.error("Error fetching update trip:", error);
		return null;
	}
}

const fetchDeleteTrip = async (tripUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_BASE_URL}/delete/${encodeURIComponent(tripUuid)}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response;
	} catch (error) {
		console.error("Error fetching update trip:", error);
		return null;
	}
}

export { fetchCreateTrip, fetchGetTrip, fetchSaveTrip, fetchUpdateTrip, fetchScriptTrip, fetchDeleteTrip }