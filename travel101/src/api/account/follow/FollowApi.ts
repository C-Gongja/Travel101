import { apiClient } from "@/api/apiClient";

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

const getAllFollowers = async (uuid: string, isAuthenticated: boolean, user: any): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/followers?uuid=${uuid}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

const getAllFollowing = async (uuid: string, isAuthenticated: boolean, user: any): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/following?uuid=${uuid}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}


export { FollowUser, UnfollowUser, getAllFollowers, getAllFollowing };