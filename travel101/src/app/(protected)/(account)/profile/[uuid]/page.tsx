'use client'

import { useEffect, useState } from "react";
import { useUserStore } from "../../../../../store/user/user-store";
import { useProfileStore } from "../../../../../store/user/user-profile-store";
import { fetchProfile } from "@/api/profile/profileApi";
import { fetchUserTrips } from "@/api/trip/tripListApi";
import { TripCardProps } from "@/types/trip/tripCardTypes";
import TripCard from "@/components/ui/card/tripCard";

interface ProfilePageProps {
	params: { uuid: string };
}

const ProfilePage = ({ params }: ProfilePageProps) => {

	const { user, isAuthenticated, clearUser } = useUserStore();
	const { profile, setProfile } = useProfileStore();
	const [tripList, setTripList] = useState<TripCardProps[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadProfileData = async () => {
			try {
				const [userData, tripsData] = await Promise.all([
					fetchProfile(params.uuid),
					fetchUserTrips(params.uuid),
				]);
				setProfile(userData);
				setTripList(tripsData);
			} catch (error) {
				console.error("Error loading profile data:", error);
			}
		};
		loadProfileData();
	}, [setProfile, setTripList]);

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
			<p>Bio:  Bio</p>

			{/* my trip */}
			<div>
				<div className="mt-10 mb-5">
					<h2>My Trips</h2>
				</div>
				{tripList && Array.isArray(tripList) && tripList.length > 0 ? (
					<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{tripList.map((trip) => (
							<TripCard key={trip.id} trip={trip} />
						))}
					</ul>
				) : (
					<p>No trips available</p>
				)}
			</div>

			<button
				onClick={clearUser}
				className="p-2 border border-red-600"
			>
				Logout
			</button>
		</div>
	);
}

export default ProfilePage;
