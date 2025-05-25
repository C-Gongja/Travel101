import { useUserStore } from "@/store/user/user-store";

const AUTH_BASE_URL = "http://localhost:8080/auth";

const apiClient = async (url: string, options: RequestInit = {}) => {
	let accessToken = localStorage.getItem("accessToken");

	const baseHeaders: Record<string, string> = {
		"Content-Type": "application/json",
	};

	// headers 병합
	let mergedHeaders: Record<string, string> = { ...baseHeaders };

	if (options.headers instanceof Headers) {
		options.headers.forEach((value, key) => {
			mergedHeaders[key] = value;
		});
	} else if (Array.isArray(options.headers)) {
		options.headers.forEach(([key, value]) => {
			mergedHeaders[key] = value;
		});
	} else if (options.headers) {
		mergedHeaders = {
			...mergedHeaders,
			...options.headers as Record<string, string>,
		};
	}

	// Authorization 추가
	if (accessToken) {
		mergedHeaders["Authorization"] = `Bearer ${accessToken}`;
	}

	try {
		const headers: HeadersInit = mergedHeaders;
		const response = await fetch(url, { ...options, headers });
		const contentType = response.headers.get("Content-Type");

		const getResponseData = async () => {
			if (contentType && contentType.includes("application/json")) {
				return await response.json();
			}
			return await response.text();
		};

		if (response.ok) {
			return getResponseData();
		}

		if (response.status === 401) {
			accessToken = await fetchRefreshToken();
			if (!accessToken) {
				localStorage.removeItem('accessToken');
				useUserStore.getState().clearUser();
				throw new Error('인증 실패: 다시 로그인해주세요');
			}

			headers.Authorization = `Bearer ${accessToken}`;
			const retryResponse = await fetch(url, { ...options, headers });
			if (!retryResponse.ok) {
				const errorData = await retryResponse.text();
				throw new Error(`재시도 요청 실패: ${errorData}`);
			}
			const retryContentType = retryResponse.headers.get("Content-Type");
			return retryContentType && retryContentType.includes("application/json")
				? await retryResponse.json()
				: await retryResponse.text();
		}
		if (response.status === 400) {
			const errorData = await getResponseData();
			throw new Error(
				typeof errorData === 'string' ? errorData : errorData.error || '알 수 없는 오류'
			);
		}

		throw new Error(`Request failed with status: ${response.status}`);
	} catch (error) {
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
