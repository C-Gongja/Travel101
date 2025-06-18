import { SignupFormData } from "@/components/auth/SignUpForm";
import { apiClient } from "../apiClient";
import { SignInFormData } from "@/components/auth/SignInForm";
import { publicApiClient } from "../publicApiClient";
import { UserAuthResponse } from "@/types/user/userTypes";

const AUTH_BASE_URL = "http://localhost:8080/auth";
const VERIFY_BASE_URL = "http://localhost:8080/api/user/verify";

const fetchSignup = async (credentials: SignupFormData): Promise<any> => {
	try {
		const response = await fetch(`${AUTH_BASE_URL}/signup`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				name: credentials.name,
				email: credentials.email,
				password: credentials.password,
			}),
			credentials: "include",
		});

		if (!response.ok) {
			const errorText = await response.json();
			throw new Error(errorText || "Signup failed");
		}
		return await response.json();

	} catch (error) {
		throw error;
	}
}

const fetchLogin = async (credentials: SignInFormData): Promise<UserAuthResponse> => {
	const response = await publicApiClient(`${AUTH_BASE_URL}/signin`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(credentials),
		credentials: "include",
	});
	console.log("fetch login: ", response);
	return response;
}

const fetchVerifyUser = async (): Promise<any> => {
	try {
		const data = await apiClient(`${VERIFY_BASE_URL}`, { method: "GET" });
		return data;
	} catch (error) {
		console.error("Error verify user:", error);
		return null;
	}
}

const fetchLogout = async (): Promise<any> => {
	try {
		await fetch(`${AUTH_BASE_URL}/logout`, {
			method: "POST",
			credentials: "include",
		});
	} catch (e) {
		console.error("Error logout user:", e);
		return null;
	}
}

export { fetchLogin, fetchSignup, fetchVerifyUser, fetchLogout }