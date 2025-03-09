import { apiClient } from "../apiClient";

const PROFILE_URL = "http://localhost:8080/api/user/profile";

const fetchProfile = async (): Promise<any> => {
	try {
		const response = await apiClient(`${PROFILE_URL}`, { method: "GET" });
		console.log("userprofile: ", response);
		return response;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

export { fetchProfile }