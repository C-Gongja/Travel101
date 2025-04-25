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
				console.log("tripsData: ", tripsData);
				setTripList(tripsData);
			} catch (error) {
				console.error("Error loading profile data:", error);
			}
		};
		loadAllTrips();
	}, [setTripList])

	return (
		<div className="mt-10">
			<div className="my-5">
				<h1>Trip List</h1>
			</div>
			{tripList && Array.isArray(tripList) && tripList.length > 0 ? (
				<ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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