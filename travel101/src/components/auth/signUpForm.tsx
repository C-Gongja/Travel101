'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import ExternalAuthButtons from "./externalAuth/externalAuth";
import { fetchSignup } from "@/api/auth/authApi";


export interface SignupFormData {
	name: string;
	email: string;
	password: string;
}

interface SignUpFormProps {
	setIsSignUp: Dispatch<SetStateAction<boolean>>;
	onClose: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setIsSignUp, onClose }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setUser, setToken } = useUserStore();
	const [formData, setFormData] = useState<SignupFormData>({
		name: "",
		email: "",
		password: "",
	});

	const handleSignInClick = () => {
		setIsSignUp(false);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevState => ({ ...prevState, [name]: value }));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		if (isLoading || !formData.name || !formData.email || !formData.password) return;

		try {
			setIsLoading(true);
			const userInfo = await fetchSignup(formData);
			setUser(userInfo.user);
			setToken(userInfo.accessToken)
			onClose();

		} catch (e: any) {
			setError(e.message);
		} finally {
			setIsLoading(false);
			onClose();
		}
	};

	return (
		<div className="flex flex-col items-center w-[420px]">
			<h1 className="text-4xl mb-4">Create your account</h1>
			<form onSubmit={onSubmit} className="flex flex-col gap-5 w-full mt-8">
				{error && (
					<span className="text-red-500 text-sm ml-7">{error}</span>
				)}
				<input
					onChange={onChange}
					name="name"
					value={formData.name}
					placeholder="Name"
					type="text"
					required
					className="px-5 py-2 rounded-xl border border-gray-300 text-lg focus:ring-2 focus:ring-maincolor"
				/>
				<input
					onChange={onChange}
					name="email"
					value={formData.email}
					placeholder="Email"
					type="email"
					required
					className="px-5 py-2 rounded-xl border border-gray-300 text-lg focus:ring-2 focus:ring-maincolor"
				/>
				<input
					onChange={onChange}
					name="password"
					value={formData.password}
					placeholder="Password"
					type="password"
					required
					className="px-5 py-2 rounded-xl border border-gray-300 text-lgfocus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="submit"
					value={isLoading ? "Loading..." : "Create Account"}
					className="cursor-pointer text-white bg-maincolor py-2 px-5 rounded-xl transition-opacity hover:opacity-80"
				/>
			</form>
			<p className="text-lg mt-5 text-center">
				Already have an account? &nbsp;
				<button onClick={handleSignInClick} className="text-maincolor">
					Sign In
				</button>
			</p>
			<ExternalAuthButtons />
		</div>
	);
}

export default SignUpForm;