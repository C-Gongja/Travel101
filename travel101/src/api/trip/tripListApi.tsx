import { apiClient } from "../apiClient";
import { publicApiClient } from "../publicApiClient";

const TRIP_BASE_URL = "http://localhost:8080/public/trip";

const fetchUserTrips = async (userUuid: string): Promise<any> => {
	try {
		const response = await publicApiClient(`${TRIP_BASE_URL}/all/${encodeURIComponent(userUuid)}`, {
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
		const response = await publicApiClient(`${TRIP_BASE_URL}/all`, {
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

export { fetchUserTrips, fetchAllTrips }