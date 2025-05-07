import { apiClient } from "@/api/apiClient";
import { UserPersonalInfo } from "@/types/user/userPersonalInfoTypes";

const FOLLOW_URL = "http://localhost:8080/api/users";

const FollowUser = async (targetId: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/follow?targetId=${targetId}`, { method: "POST" });
		return response;
	} catch (error) {
		console.error("Error fetching update trip:", error);
		return null;
	}
}

const UnfollowUser = async (targetId: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/unfollow?targetId=${targetId}`, { method: "DELETE" });
		return response;
	} catch (error) {
		console.error("Error fetching update trip:", error);
		return null;
	}
}

const getFollowCounts = async (targetId: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(targetId),
		});
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

const getAllFollow = async (targetId: string): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(targetId),
		});
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

export { FollowUser, UnfollowUser, getFollowCounts, getAllFollow }