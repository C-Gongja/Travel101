
const publicApiClient = async (url: string, options: RequestInit = {}) => {

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...options.headers,
	};

	try {
		const response = await fetch(url, { ...options, headers });
		if (response.ok) {
			return response.json();
		}
		const errorBody = await response.json();
		throw errorBody;
	} catch (error) {
		// console.error("API request error:", error);
		throw error;
	}
};

export { publicApiClient };
