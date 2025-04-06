
import { SignupFormData } from "@/components/auth/signUpForm";
import { apiClient } from "../apiClient";
import { SignInFormData } from "@/components/auth/signInForm";

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

const fetchLogin = async (credentials: SignInFormData): Promise<any> => {
	try {
		const response = await fetch(`${AUTH_BASE_URL}/signin`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: credentials.email,
				password: credentials.password,
			}),
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(JSON.stringify(errorData));
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}
const fetchVerifyUser = async (): Promise<any> => {
	try {
		const data = await apiClient(`${VERIFY_BASE_URL}`, { method: "GET" });
		return data;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

export { fetchLogin, fetchSignup, fetchVerifyUser }