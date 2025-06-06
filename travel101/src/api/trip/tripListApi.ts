import { apiClient } from "../apiClient";
import { publicApiClient } from "../publicApiClient";

const PUBLIC_TRIP_URL = "http://localhost:8080/public/trip";
const TRIP_URL = "http://localhost:8080/api/trip";

const fetchUserTrips = async (userUuid: string): Promise<any> => {
	try {
		const response = await publicApiClient(`${PUBLIC_TRIP_URL}/all/${encodeURIComponent(userUuid)}`, {
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

const fetchAllTrips = async (): Promise<any> => {
	try {
		const response = await publicApiClient(`${PUBLIC_TRIP_URL}/all`, {
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

const fetchCloneTrips = async (userUuid: string): Promise<any> => {
	return await apiClient(`${TRIP_URL}/getCloneTripList?userUid=${userUuid}`, {
		method: "GET"
	});
}

export { fetchUserTrips, fetchAllTrips, fetchCloneTrips }