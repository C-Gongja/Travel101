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

export { FollowUser, UnfollowUser };

interface FetchInfiniteFollowOptions {
	uuid: string;
	page: number;
	limit: number;
}

export const getFollowersPaginated = async ({
	uuid,
	page,
	limit,
}: FetchInfiniteFollowOptions): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/inffollowers?uuid=${uuid}&page=${page}&limit=${limit}`, { method: "GET" });
		return response; // { followers: [...], hasNext: true }
	} catch (error) {
		console.error("Error fetching followers:", error);
		return { followers: [], hasNext: false };
	}
};

export const getFollowingPaginated = async ({
	uuid,
	page,
	limit,
}: FetchInfiniteFollowOptions): Promise<any> => {
	try {
		const response = await apiClient(`${FOLLOW_URL}/inffollowing?uuid=${uuid}&page=${page}&limit=${limit}`, { method: "GET" });
		return response; // { followers: [...], hasNext: true }
	} catch (error) {
		console.error("Error fetching following:", error);
		return { followers: [], hasNext: false };
	}
};