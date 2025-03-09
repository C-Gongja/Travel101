'use client'

import { useEffect, useState } from "react";
import { useUserStore } from "../../components/stateManagement/user-store";
import { useProfileStore } from "../../components/stateManagement/user-profile-store";
import { fetchProfile } from "@/app/api/profile/profileApi";

export default function ProfilePage() {
	const { user, isAuthenticated, clearUser } = useUserStore();
	const { profile, setProfile } = useProfileStore();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchProfile();
				setProfile(data);
			} catch (err) {
				setError("Error fetching profile data.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [setProfile]);

	if (loading) {
		return <div>Loading...</div>; // 로딩 중일 때 표시
	}

	return (
		<div className="pt-[50px] px-[180px]">
			<h1>Profile</h1>
			{error && <p className="text-red-500">{error}</p>} {/* 에러 메시지 표시 */}

			<p>Email: {profile?.email || "Email not available"}</p>
			<p>Name: {user?.name || "Name not available"}</p>
			<p>Username: {profile?.username || "Set username"}</p>
			<p>Region: {profile?.country ? profile?.country : "Set your region"}</p>

			<button
				onClick={clearUser}
				className="p-2 border border-red-600"
			>
				Logout
			</button>
		</div>
	);
}
