import { apiClient } from "@/api/apiClient";
import { UserPersonalInfo } from "@/types/user/userPersonalInfoTypes";

const PERSONAL_INFO_URL = "http://localhost:8080/api/user/account";

const getPersonalInfo = async (userUuid: string): Promise<any> => {
	try {
		const response = await apiClient(`${PERSONAL_INFO_URL}/${encodeURIComponent(userUuid)}`, { method: "GET" });
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}

const patchPersonalInfo = async (partialUpdateData: Partial<UserPersonalInfo>, userUuid: string) => {
	try {
		const response = await apiClient(`${PERSONAL_INFO_URL}/${encodeURIComponent(userUuid)}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(partialUpdateData),
		});

		return await response;
	} catch (error) {
		throw error;
	}
};

export { getPersonalInfo, patchPersonalInfo }