'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import ExternalAuthButtons from "../externalAuth/externalAuth";
import { useUserStore } from "../stateManagement/user-store";
import { fetchLogin } from "@/app/api/auth/authApi";

export interface SignInFormData {
	email: string;
	password: string;
}

interface SignInFormProps {
	setIsSignUp: Dispatch<SetStateAction<boolean>>;
	onClose: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ setIsSignUp, onClose }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { setUser, setToken } = useUserStore();
	const [formData, setFormData] = useState<SignInFormData>({
		email: "",
		password: "",
	});

	const handleSignUpClick = () => {
		setIsSignUp(true);  // 회원가입 폼으로 전환
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevState => ({ ...prevState, [name]: value }));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		try {
			setIsLoading(true);
			const userInfo = await fetchLogin(formData);
			setUser(userInfo.user);
			setToken(userInfo.accessToken);
			onClose();
		} catch (e: any) {
			const error = JSON.parse(e.message);
			if (error.errorCode === "EMAIL_NOT_FOUND") {
				setError(error.message);
			} else if (error.errorCode === "INVALID_PASSWORD") {
				setError(error.message);
			} else if (error.errorCode === "MISSING_FIELDS") {
				setError(error.message);
			} else {
				setError("Login failed. Please try again."); // 기본 에러 메시지
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center w-[420px]">
			<h1 className="text-4xl">Sign in</h1>
			<form
				onSubmit={onSubmit}
				className="flex flex-col gap-5 w-full mt-14 mb-2"
			>
				{error && (
					<span className="text-red-500 text-sm ml-7">{error}</span>
				)}
				<input
					onChange={onChange}
					name="email"
					value={formData.email}
					placeholder="Email"
					className="px-5 py-2 rounded-xl border border-gray-300 text-lg"
				/>
				<input
					onChange={onChange}
					type="password"
					name="password"
					value={formData.password}
					placeholder="Password"
					className="px-5 py-2 rounded-xl border border-gray-300 text-lg"
				/>
				<input
					type="submit"
					value={isLoading ? "Loading..." : "Sign In"}
					className="cursor-pointer text-white bg-maincolor py-2 px-5 rounded-xl transition-opacity hover:opacity-80"
				/>
			</form>
			<p className="text-lg mt-5 text-center">
				Don't have an account? &nbsp;
				<button onClick={handleSignUpClick} className="text-maincolor">
					Create one
				</button>
			</p>
			<ExternalAuthButtons />
		</div>
	);
}

export default SignInForm;
