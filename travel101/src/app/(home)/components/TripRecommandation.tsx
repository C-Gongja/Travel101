import { useEffect, useState } from "react";
import { TripCardProps } from "@/types/trip/tripCardTypes";
import { fetchAllTrips } from "@/api/trip/tripListApi";
import TripCard from "@/components/ui/card/tripCard";

export default function TripRecommandation() {
	const [tripList, setTripList] = useState<TripCardProps[] | null>(null);

	useEffect(() => {
		const loadAllTrips = async () => {
			try {
				const [tripsData] = await Promise.all([
					fetchAllTrips(),
				]);
				setTripList(tripsData);
			} catch (error) {
				console.error("Error loading profile data:", error);
			}
		};
		loadAllTrips();
	}, [setTripList])

	return (
		<div className="">
			<div className="">
				<h1>Trip List</h1>
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
	);
}