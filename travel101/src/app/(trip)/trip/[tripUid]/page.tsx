'use client';

import { useEffect, useState } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { fetchGetTrip } from "@/api/trip/tripApi";
import { MapProvider } from "../../../../components/trip/map/mapProvider";
import { MapComponent } from "../../../../components/trip/map/mapComponent";
import TripCustom from "../../../../components/trip/trip/tripCustom";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user/user-store";
import UserSnippetCard from "@/components/ui/card/UserSnippetCard";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { CommentSection } from "@/components/trip/comment/CommentSection";

export default function TripPage() {
	const { tripUid } = useParams<{ tripUid: string }>();
	const { trip, setTrip, setIsOwner } = useTripStore();
	const { user, isAuthenticated, isUserLoading } = useUserStore();
	const [isInitializing, setIsInitializing] = useState(true);
	const [userSnippet, setUserSnippet] = useState<UserSnippet>();
	const targetType = 'TRIP';
	const queryClient = useQueryClient();

	const { data: tripData, isLoading } = useQuery({
		queryKey: ['trip', tripUid],
		queryFn: () => fetchGetTrip({ tripUid: tripUid, isAuthenticated, user }),
		initialData: () => queryClient.getQueryData(['trip', tripUid]), // Home에서 캐싱된 데이터 사용
		staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
		enabled: isAuthenticated !== null, // user 상태가 로드된 후에만 실행
	});

	useEffect(() => {
		if (tripData && isInitializing) {
			setTrip({
				...tripData.trip,
				startDate: new Date(tripData.trip.startDate),
				endDate: new Date(tripData.trip.endDate),
			});
			setIsOwner(tripData.editable);
			setUserSnippet(tripData.userSnippet);
			setIsInitializing(false);
		}
	}, [tripData, isInitializing, setTrip, setIsOwner]);

	const toggleFollow = (uuid: string, isFollowing: boolean) => {
		setUserSnippet(prev =>
			prev?.uuid == uuid ? { ...prev, isFollowing } : prev
		);
	};

	if (isUserLoading || isLoading || isInitializing || !trip) {
		return <div>Loading trip data...</div>;
	}

	return (
		<div className="flex flex-col px-4">
			<h1 className="text-4xl font-bold mb-10"></h1>
			<div className="grid grid-cols-2 gap-4 w-full h-auto mb-12">
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
			{/* Account info card */}
			<div className="mb-5">
				{userSnippet && (<UserSnippetCard userSnippet={userSnippet} toggleFollow={toggleFollow} />)}
			</div>
			<div className="border-b-2"></div>
			{/* comments */}
			<div className="">
				<CommentSection targetType={targetType} />
			</div>
		</div>
	);
}