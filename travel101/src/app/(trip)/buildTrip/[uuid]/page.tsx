'use client';

import { useEffect, useState } from "react";
import { useTripStore } from "@/app/store/createTrip/trip-store";
import { fetchGetTrip } from "@/app/api/trip/tripApi";
import { MapProvider } from "../../components/map/mapProvider";
import { MapComponent } from "../../components/map/mapComponent";
import TripCustom from "../../components/trip/tripCustom";
import { useParams } from "next/navigation";


export default function BuildTripPage() {
	const params = useParams();
	const { trip, isLoading, createTrip, setTrip, setIsOwner } = useTripStore();
	const [isInitializing, setIsInitializing] = useState(true);

	//make sure this only happens in first time entrance
	const initializeTrip = async (uuid: string | undefined) => {
		try {
			if (!uuid) {
				console.log("No existing trip found, creating a new one...");
				createTrip();
			} else {
				const tripData = await fetchGetTrip(uuid);
				setTrip({
					...tripData.trip,
					startDate: new Date(tripData.trip.startDate),
					endDate: new Date(tripData.trip.endDate),
				});
				setIsOwner(tripData.editable);
			}
		} catch (error) {
			console.error("Error initializing trip:", error);
		} finally {
			setIsInitializing(false); // 초기화 완료
		}
	};

	useEffect(() => {
		const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;
		initializeTrip(uuid);
	}, [params.uuid]);

	if (isInitializing || !trip) {
		return <div>Loading trip data...</div>;
	}

	return (
		<div className="flex justify-center items-center flex-col px-4">
			<h1 className="text-4xl font-bold mb-10">Build Your Own Trip!</h1>
			<div className="grid grid-cols-2 gap-4 w-full h-[calc(100vh-500px)]">
				{/* Map section */}
				<div className="">
					{isLoading ?
						<div></div>
						:
						(
							<MapProvider>
								<MapComponent />
							</MapProvider>
						)
					}
				</div>

				{/* Trip section (스크롤 가능) */}
				<div className="bg-white p-4 rounded-lg overflow-y-auto no-scrollbar">
					<TripCustom />
				</div>
			</div>
		</div>
	);
}