import { useFetchUserTrips } from "@/hooks/tripList/useFetchUserTrips";
import TripCard from "../../ui/card/TripCard";
import { useEffect } from "react";

interface UserCardProps {
	uuid: string;
}

const UserTrips: React.FC<UserCardProps> = ({ uuid }) => {
	const { data: tripList, isLoading: isTripsLoading, isError: isTripsError } = useFetchUserTrips(uuid);

	return (
		<>
			{tripList && Array.isArray(tripList) && tripList.length > 0 ? (
				<ul className="flex flex-wrap gap-4">
					{tripList.map((trip) => (
						<TripCard key={trip?.tripUid} trip={trip} />
					))}
				</ul>
			) : (
				<p>No trips available</p>
			)}
		</>
	);
}

export default UserTrips;