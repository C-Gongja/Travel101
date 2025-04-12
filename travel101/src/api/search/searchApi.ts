import { publicApiClient } from "../publicApiClient";

const SEARCH_PUBLIC_URL = "http://localhost:8080/public/search";

const fetchSearch = async (keyword: string): Promise<any> => {
	try {
		const response = await publicApiClient(`${SEARCH_PUBLIC_URL}?keyword=${encodeURIComponent(keyword)}`, {
			method: "GET",
		});

		return response;
	} catch (error) {
		console.error("Search failed:", error);
		return null;
	}
}


export { fetchSearch, }