'use client';

import { useEffect, useState } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { CommentSection } from "@/components/comment/CommentSection";
import { MapProvider } from "@/components/trip/map/MapProvider";
import { Day, Trip } from "@/types/trip/tripStoreTypes";

import UserSnippetCard from "@/components/ui/card/UserSnippetCard";
import MapController from "@/components/trip/map/MapController";
import TripCustom from "@/components/trip/trip/tripCustom";

export default function TripCreatePage() {
	const { tripUid } = useParams<{ tripUid: string }>();
	const { trip, setTrip, setIsOwner } = useTripStore();
	const { user, isAuthenticated, isUserLoading } = useUserStore();
	const [isInitializing, setIsInitializing] = useState(true);
	const [userSnippet, setUserSnippet] = useState<UserSnippet>();
	const targetType = 'TRIP';

	const initializeDays = (startDate: Date, endDate: Date): Day[] => {
		const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
		return Array.from({ length: dayCount }, (_, index) => ({
			number: index + 1,
			locations: [],
		}));
	};

	useEffect(() => {
		const today = new Date();
		const defaultEndDate = new Date(today);
		defaultEndDate.setDate(today.getDate() + 1);

		const defaultTrip: Trip = {
			tripUid: "",
			name: 'New Trip',
			startDate: today,
			endDate: defaultEndDate,
			days: initializeDays(today, defaultEndDate),
			scripted: 0,
			completed: false,
			countries: [],
			isLiked: false,
			likesCount: 0,
			scriptedCount: 0,
			commentsCount: 0
		};

		const defaultUserSnippet: UserSnippet = {
			uuid: user?.uid ?? "",
			name: user?.name ?? "",
			username: user?.username ?? "",
			isFollowing: false,
		};

		setTrip(defaultTrip);
		setIsOwner(true);
		setUserSnippet(defaultUserSnippet);
	}, []);

	const toggleFollow = (uuid: string, isFollowing: boolean) => {
		setUserSnippet(prev =>
			prev?.uuid == uuid ? { ...prev, isFollowing } : prev
		);
	};

	return (
		<div className="flex flex-col px-4">
			<h1 className="text-4xl font-bold mb-10"></h1>
			<div className="grid grid-cols-2 gap-4 w-full h-auto mb-12">
				{/* Map section */}
				<MapProvider>
					<MapController />
				</MapProvider>

				{/* Trip section (스크롤 가능) */}
				<div className="bg-white p-4 rounded-lg overflow-y-auto no-scrollbar">
					<TripCustom />
				</div>
			</div>
			{/* how to show default Account info card */}
			<div className="mb-5">
				{userSnippet && (<UserSnippetCard userSnippet={userSnippet} toggleFollow={toggleFollow} />)}
			</div>
			<div className="border-b-2"></div>
			{/* how to show default comments */}
			<div className="">
				<CommentSection targetType={targetType} targetUid={tripUid} />
			</div>
		</div>
	);
}