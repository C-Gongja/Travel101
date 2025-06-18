'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import ExternalAuthButtons from "./externalAuth/ExternalAuth";
import { fetchLogin } from "@/api/auth/authApi";
import { useAuthModalStore } from "@/store/user/useAuthModalStore";
import { useSignIn } from "@/hooks/auth/useSignIn";

export interface SignInFormData {
	email: string;
	password: string;
}

interface SignInFormProps {
}

const SignInForm: React.FC<SignInFormProps> = () => {
	const { setIsSignUp, afterAuthCallback, onClose, setAfterAuthCallback } = useAuthModalStore();
	const [formData, setFormData] = useState<SignInFormData>({
		email: "",
		password: "",
	});

	const handleLoginSuccess = () => {
		if (afterAuthCallback) {
			afterAuthCallback();
			setAfterAuthCallback(null);
		}
		onClose();
	};

	const { mutate: signIn, isPending: isLoading, error } = useSignIn(handleLoginSuccess);

	const displayError = error?.message || "";

	const handleSignUpClick = () => {
		setIsSignUp(true);  // 회원가입 폼으로 전환
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevState => ({ ...prevState, [name]: value }));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // 기본 폼 제출 동작(페이지 새로고침)을 막습니다.
		signIn(formData); // `useSignIn` 훅의 뮤테이션 함수를 호출하여 로그인 요청을 보냅니다.
	};

	return (
		<div className="flex flex-col items-center w-[420px]">
			<h1 className="text-4xl">Sign in</h1>
			<form
				onSubmit={onSubmit}
				className="flex flex-col gap-5 w-full mt-14 mb-2"
			>
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
				{displayError && (
					<span className="text-red-500 text-sm ml-2">{displayError}</span>
				)}
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
