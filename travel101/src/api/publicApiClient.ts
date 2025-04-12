
const publicApiClient = async (url: string, options: RequestInit = {}) => {

	const headers: HeadersInit = {
		...options.headers,
	};

	try {
		const response = await fetch(url, { ...options, headers });
		if (response.ok) {
			return response.json();
		}
		throw new Error(`Request failed with status: ${response.status}`);
	} catch (error) {
		console.error("API request error:", error);
		throw error;
	}
};

export { publicApiClient };
