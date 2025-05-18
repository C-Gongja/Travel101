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
				<ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
					{tripList.map((trip) => (
						<TripCard key={trip?.id} trip={trip} />
					))}
				</ul>
			) : (
				<p>No trips available</p>
			)}
		</>
	);
}

export default UserTrips;