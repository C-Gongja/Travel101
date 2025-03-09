import { useUserStore } from "../components/stateManagement/user-store";


const AUTH_BASE_URL = "http://localhost:8080/auth";

const apiClient = async (url: string, options: RequestInit = {}) => {
	let accessToken = localStorage.getItem("accessToken");

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${accessToken}`,
		...options.headers,
	};

	try {
		const response = await fetch(url, { ...options, headers });

		if (response.ok) {
			return response.json();
		}

		if (response.status === 401) {
			console.log("access token is expired, use refresh token to get new access token");

			accessToken = await fetchRefreshToken();
			if (!accessToken) {
				localStorage.removeItem('accessToken');
				useUserStore.getState().clearUser();
				throw new Error('Authentication failed: Please log in again');
			}

			headers.Authorization = `Bearer ${accessToken}`;
			const retryResponse = await fetch(url, { ...options, headers });

			if (!retryResponse.ok) throw new Error("Retry request failed");

			return retryResponse.json();
		}

		throw new Error(`Request failed with status: ${response.status}`);
	} catch (error) {
		console.error("API request error:", error);
		throw error;
	}
};

const fetchRefreshToken = async (): Promise<string | null> => {
	try {
		const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
			method: 'POST',
			credentials: 'include', // refreshToken 
		});

		if (response.ok) {
			const data = await response.json();
			localStorage.setItem('accessToken', data.accessToken);
			return data.accessToken;
		}

		if (response.status === 401) {
			throw new Error('Refresh token invalid or expired');
		}

		throw new Error(`Refresh token request failed with status: ${response.status}`);
	} catch (error: any) {
		console.error('Fetch refresh token error:', error.message);
		return null;
	}
};

export { apiClient };
