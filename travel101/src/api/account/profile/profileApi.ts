import { apiClient } from "@/api/apiClient";
import { publicApiClient } from "@/api/publicApiClient";

const PROFILE_URL = "http://localhost:8080/api/user/profile";
const PUBLIC_PROFILE_URL = "http://localhost:8080/public/user/profile";

interface FetchProfileOptions {
	uuid: string;
	isAuthenticated: boolean | null;
	user: any;
}

const fetchProfile = async ({ uuid, isAuthenticated, user }: FetchProfileOptions): Promise<any> => {
	const client = isAuthenticated && user ? apiClient : publicApiClient;
	const url = isAuthenticated && user ? PROFILE_URL : PUBLIC_PROFILE_URL;

	try {
		const response = await client(`${url}/${encodeURIComponent(uuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

export { fetchProfile }