'use client';

import { useEffect, useState } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { fetchGetTrip } from "@/api/trip/tripApi";
import { MapProvider } from "../../components/map/mapProvider";
import { MapComponent } from "../../components/map/mapComponent";
import TripCustom from "../../components/trip/tripCustom";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user/user-store";

export default function TripPage() {
	const params = useParams();
	const { trip, setTrip, setIsOwner } = useTripStore();
	const { user, isAuthenticated, isUserLoading } = useUserStore();
	const [isInitializing, setIsInitializing] = useState(true);

	const queryClient = useQueryClient();
	const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;

	const { data: tripData, isLoading } = useQuery({
		queryKey: ['trip', uuid],
		queryFn: () => fetchGetTrip({ tripUuid: uuid, isAuthenticated, user }),
		initialData: () => queryClient.getQueryData(['trip', uuid]), // Home에서 캐싱된 데이터 사용
		staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
		enabled: isAuthenticated !== null, // user 상태가 로드된 후에만 실행
	});

	useEffect(() => {
		console.log(tripData)
		if (tripData && isInitializing) {
			setTrip({
				...tripData.trip,
				startDate: new Date(tripData.trip.startDate),
				endDate: new Date(tripData.trip.endDate),
			});
			setIsOwner(tripData.editable);
			setIsInitializing(false);
		}
	}, [tripData, isInitializing, setTrip, setIsOwner]);

	if (isUserLoading || isLoading || isInitializing || !trip) {
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