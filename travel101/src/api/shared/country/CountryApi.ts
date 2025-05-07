import { publicApiClient } from "@/api/publicApiClient";

const COUNTRY_URL = "http://localhost:8080/public/country";

const getAllCountries = async (): Promise<any> => {
	try {
		const response = await publicApiClient(`${COUNTRY_URL}/all`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error getPersonalInfo:", error);
		return null;
	}
}
export { getAllCountries }