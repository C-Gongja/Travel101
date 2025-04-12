import { apiClient } from "../apiClient";
import { Trip } from "@/types/trip/tripStoreTypes";
import { publicApiClient } from "../publicApiClient";
import { useUserStore } from "@/store/user/user-store";

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
		console.log("create log: ", response);
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

		return JSON.stringify(response);
	} catch (error) {
		console.error("Error fetching post trip:", error);
		return null;
	}
}

interface FetchTripOptions {
	tripUuid: string;
	isAuthenticated: boolean | null;
	user: any; // user 타입은 프로젝트에 따라 구체화 필요
}

const fetchGetTrip = async ({ tripUuid, isAuthenticated, user }: FetchTripOptions): Promise<any> => {
	const client = isAuthenticated && user ? apiClient : publicApiClient;
	const url = isAuthenticated && user ? TRIP_BASE_URL : TRIP_PUBLIC_URL;

	console.log("url", url)
	try {
		const response = await client(`${url}/${encodeURIComponent(tripUuid)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error fetching trip:", error);
		throw new Error(`Failed to fetch trip with UUID: ${tripUuid}`);
	}
};

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
	console.log("delete trip:", tripUuid)
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