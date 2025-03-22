import { Trip, useTripStore } from "@/app/components/stateManagement/createTrip/trip-store";
import { apiClient } from "../apiClient";

const TRIP_POST_URL = "http://localhost:8080/public/trip/post";
const TRIP_GET_URL = "http://localhost:8080/public/trip";

const fetchCreateTrip = async (trip: Trip): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_POST_URL}`, {
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

const fetchGetTrip = async (tripUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${TRIP_GET_URL}/${encodeURIComponent(tripUuid)}`, {
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


export { fetchCreateTrip, fetchGetTrip }