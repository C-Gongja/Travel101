import { apiClient } from "@/api/apiClient";
import { UserPersonalInfo } from "@/types/user/userPersonalInfoTypes";

const FOLLOW_URL = "http://localhost:8080/api/user/account";

const FollowUser = async (userUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/${encodeURIComponent(userUuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

const UnfollowUser = async (userUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/${encodeURIComponent(userUuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

const getFollowCounts = async (userUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/${encodeURIComponent(userUuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

const getAllFollow = async (userUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/${encodeURIComponent(userUuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

export { FollowUser, UnfollowUser, getFollowCounts, getAllFollow }