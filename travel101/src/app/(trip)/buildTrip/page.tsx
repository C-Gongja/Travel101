'use client';

import { useEffect } from "react";
import TripCustom from "../components/trip/tripCustom";
import { useTripStore } from "@/app/components/stateManagement/createTrip/trip-store";
import { fetchGetTrip } from "@/app/api/trip/tripApi";

export default function BuildTripPage() {
	const { trip, createTrip, setTrip } = useTripStore();

	//make sure this only happens in first time entrance
	const initializeTrip = async () => {
		const existingTripId = localStorage.getItem("tripId");

		if (!existingTripId) {
			console.log("No existing trip found, creating a new one...");
			await createTrip();
		} else {
			const tripData = await fetchGetTrip(existingTripId);

			if (tripData) {
				setTrip({
					...tripData,
					startDate: new Date(tripData.startDate), // change string to Date format
					endDate: new Date(tripData.endDate),
				});
			} else {
				//if failed to fetch trip data with uuid
				console.error("Failed to fetch existing trip, creating a new one...");
				// await createTrip();
			}
		}
	};

	useEffect(() => {
		initializeTrip();
	}, []);

	return (
		<div className="flex justify-center items-center flex-col min-h-screen px-4">
			<h1 className="text-4xl font-bold mb-10">Build Your Own Trip!</h1>
			<div className="grid grid-cols-2 gap-4 w-full h-[calc(100vh-200px)]">
				{/* Map section */}
				<div className="bg-gray-200 p-4 rounded-lg">
					<h1 className="text-xl font-semibold">Map</h1>
					{/* 여기에 지도 컴포넌트 추가 가능 */}
				</div>

				{/* Trip section (스크롤 가능) */}
				<div className="bg-white p-4 rounded-lg overflow-y-auto no-scrollbar">
					<TripCustom />
				</div>
			</div>
		</div>
	);
}