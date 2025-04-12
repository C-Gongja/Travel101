'use client';

import { fetchVerifyUser } from "@/api/auth/authApi";
import { useUserStore } from "@/store/user/user-store";
import React, { useState, useEffect, ReactNode } from "react";

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [isUserInitialized, setIsUserInitialized] = useState(false);
	const { setUser, setIsUserLoading } = useUserStore();

	const verifyUser = async () => {
		try {
			setIsUserLoading(true);
			const response = await fetchVerifyUser();

			if (response?.user) {
				setUser({
					uuid: response.user.uuid,
					name: response.user.name,
					roles: response.user.roles.map((role: any) => role.authority),
				});
				localStorage.setItem("accessToken", response.accessToken);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("User verification failed:", error);
			setUser(null);
		} finally {
			setIsUserLoading(false);
			setIsUserInitialized(true);
		}
	};

	useEffect(() => {
		verifyUser();
	}, []);

	return (
		<UserProviderContext.Provider value={{ isUserInitialized }}>
			{children}
		</UserProviderContext.Provider>
	);
};

// UserProviderContext 생성 및 제공
export const UserProviderContext = React.createContext<{ isUserInitialized: boolean } | undefined>(undefined);

// Context Hook 생성
export const useUserContext = () => {
	const context = React.useContext(UserProviderContext);
	if (!context) {
		throw new Error("useUserContext must be used within a UserProvider");
	}
	return context;
};
