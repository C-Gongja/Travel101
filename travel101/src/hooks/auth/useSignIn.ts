// hooks/useSignIn.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { SignInFormData } from '@/components/auth/SignInForm'; // SignInFormData 경로 확인
import { useUserStore } from '@/store/user/user-store';
import { fetchLogin } from '@/api/auth/authApi';
import { UserAuthResponse } from '@/types/user/userTypes';

export const useSignIn = (onSuccessCallback: () => void) => {
	const { setUser, setToken } = useUserStore();

	return useMutation({
		mutationFn: async (formData: SignInFormData) => {
			const userInfo = await fetchLogin(formData);
			return userInfo;
		},
		onSuccess: (userInfo) => {
			setUser(userInfo.user);
			setToken(userInfo.accessToken);
			onSuccessCallback();
		},
		onError: (error: any) => {
			const parsedError = JSON.parse(error.message);
			if (parsedError.errorCode === 'EMAIL_NOT_FOUND') {
				return parsedError.message;
			} else if (parsedError.errorCode === 'INVALID_PASSWORD') {
				return parsedError.message;
			} else if (parsedError.errorCode === 'MISSING_FIELDS') {
				return parsedError.message;
			}
			return 'Login failed. Please try again.';
		},
	});
};