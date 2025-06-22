import { useEffect, useState } from "react";
import { TripCardProps } from "@/types/trip/tripCardTypes";
import { fetchAllTrips } from "@/api/trip/tripListApi";
import TripCard from "@/components/ui/card/TripCard";
import { DotsSpinner } from "../ui/spinner/DotsSpinner";

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

	if (!tripList) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<DotsSpinner />
			</div>
		);
	}

	return (
		<div className="mt-10">
			<div className="my-5">
				<h1>Trip List</h1>
			</div>
			{tripList && Array.isArray(tripList) && tripList.length > 0 ? (
				<ul className="flex flex-wrap gap-5">
					{tripList.map((trip) => (
						<TripCard key={trip.tripUid} trip={trip} />
					))}
				</ul>
			) : (
				<p>No trips available</p>
			)}
		</div>
	);
}