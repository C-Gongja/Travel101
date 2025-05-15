import { publicApiClient } from "@/api/publicApiClient";

const PUBLIC_PROFILE_URL = "http://localhost:8080/public/user/profile";

const fetchProfile = async (userUuid: string): Promise<any> => {
	try {
		const response = await publicApiClient(`${PUBLIC_PROFILE_URL}/${encodeURIComponent(userUuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

export { fetchProfile }