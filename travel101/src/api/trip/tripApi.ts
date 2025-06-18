import { apiClient } from "../apiClient";
import { Trip, TripRequest } from "@/types/trip/tripStoreTypes";
import { publicApiClient } from "../publicApiClient";
import { useUserStore } from "@/store/user/user-store";
import { ScriptDay, ScriptLocation } from "@/types/trip/tripScriptTypes";

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

interface FetchTripOptions {
	tripUid: string;
	isAuthenticated: boolean | null;
	user: any; // user 타입은 프로젝트에 따라 구체화 필요
}

const fetchGetTrip = async ({ tripUid, isAuthenticated, user }: FetchTripOptions): Promise<any> => {
	const client = isAuthenticated && user ? apiClient : publicApiClient;
	const url = isAuthenticated && user ? TRIP_BASE_URL : TRIP_PUBLIC_URL;

	try {
		const response = await client(`${url}/${encodeURIComponent(tripUid)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("get trip: ", response);
		return response;
	} catch (error) {
		console.error("Error fetching trip:", error);
		throw new Error(`Failed to fetch trip with UUID: ${tripUid}`);
	}
};

const fetchSaveTrip = async (tripUuid: string, updatedTrip: TripRequest): Promise<any> => {
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
		const response = await apiClient(`${TRIP_BASE_URL}/${encodeURIComponent(tripUuid + 1)}`, {
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
	return await apiClient(`${TRIP_BASE_URL}/delete/${encodeURIComponent(tripUuid)}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
}

// const fetchScriptTrip = async (tripUuid: string): Promise<any> => {
// 	try {
// 		const response = await apiClient(`${TRIP_BASE_URL}/scriptTrip/${tripUuid + 1}`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});

// 		return JSON.stringify(response);
// 	} catch (error) {
// 		console.error("Error fetching post trip:", error);
// 		return null;
// 	}
// }

const tripScriptApi = async (tripUid: string): Promise<any> => {
	return await apiClient(`http://localhost:8080/api/script/scriptTrip?tripUid=${tripUid + 1}`, {
		method: 'POST',
	});
};

const tripScriptDayApi = async (body: ScriptDay): Promise<any> => {
	return await apiClient(`http://localhost:8080/api/script/scriptDay`, {
		method: 'POST',
		body: JSON.stringify(body),
	});
};

const tripScriptLocationApi = async (body: ScriptLocation): Promise<any> => {
	return await apiClient(`http://localhost:8080/api/script/scriptLocation`, {
		method: 'POST',
		body: JSON.stringify(body),
	});
};

export { fetchCreateTrip, fetchGetTrip, fetchSaveTrip, fetchUpdateTrip, fetchDeleteTrip, tripScriptApi, tripScriptDayApi, tripScriptLocationApi }