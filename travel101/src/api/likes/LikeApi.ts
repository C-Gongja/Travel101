import { apiClient } from "@/api/apiClient";

const LIKE_URL = "http://localhost:8080/api/likes";

const addLikesApi = async (targetType: string, targetUid: string): Promise<any> => {
	return await apiClient(`${LIKE_URL}/addlike?targetType=${targetType}&targetUid=${targetUid}`, {
		method: 'POST'
	});
}

const removeLikesApi = async (targetType: string, targetUid: string): Promise<any> => {
	return await apiClient(`${LIKE_URL}/removelike?targetType=${targetType}&targetUid=${targetUid}`, {
		method: "DELETE"
	});
}

export { addLikesApi, removeLikesApi }