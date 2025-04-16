'use client'

import { useUserStore } from "../../../../../store/user/user-store";
import TripCard from "@/components/ui/card/tripCard";
import { useFetchProfile } from "@/hooks/profile/useFetchProfile";
import { useFetchUserTrips } from "@/hooks/tripList/useFetchUserTrips";
import { useParams } from "next/navigation";


export default function ProfilePage() {
	const { uuid } = useParams<{ uuid: string }>();
	const { user, clearUser } = useUserStore();
	// const { setProfile } = useProfileStore();
	const { data: profile, isLoading } = useFetchProfile(uuid);
	const { data: tripList, isLoading: isTripsLoading, isError: isTripsError } = useFetchUserTrips(uuid);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="pt-[50px] px-[180px]">
			<h1>Profile</h1>

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
