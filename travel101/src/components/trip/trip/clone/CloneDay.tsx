'use client'

import useScriptDay from "@/hooks/trip/useScriptDay";
import { useFetchUserTrips } from "@/hooks/tripList/useFetchUserTrips";
import { useTripStore } from "@/store/trip/trip-store";
import { useUserStore } from "@/store/user/user-store";
import clsx from "clsx";
import { useState } from "react";

interface CloneDayProps {
	cloneDayNum: number;
}

export const CloneDay = ({ cloneDayNum }: CloneDayProps) => {
	const { user } = useUserStore();
	const { trip } = useTripStore();
	const { data: tripList, isLoading: isTripsLoading, isError: isTripsError } = useFetchUserTrips(user?.uuid);
	const { scriptTripDay } = useScriptDay();
	const [selectedTrip, setSelectedTrip] = useState<string>("");

	const handleClickTrip = (tripUid: string) => {
		console.log("click trip: ", tripUid);
		setSelectedTrip(tripUid);
	}

	const handleCloneClick = () => {
		if (!trip) return;

		scriptTripDay({
			tripUid: trip.tripUid,
			dayNum: cloneDayNum,
			targetTripUid: selectedTrip,
		});
	};

	return (
		<div className="w-full max-w-[600px] min-w-[400px]">
			<h2 className="text-3xl text-center mb-5">{user?.username}'s Trip</h2>
			{tripList &&
				tripList.map((trip: any, index: number) => {
					const isSelected = trip.tripUid === selectedTrip;

					return (
						<button
							key={index}
							onClick={() => handleClickTrip(trip.tripUid)}
							className={clsx(
								"flex justify-between p-3 border-2 mt-3 w-full rounded-xl",
								{
									"bg-maincolor text-white cursor-default": isSelected, // 선택된 trip 스타일
									"hover:bg-gray-200": !isSelected, // 비선택된 trip만 hover 효과
								}
							)}
						>
							<div>{trip?.name}</div>
							<div>{trip?.startDate}-{trip?.endDate}</div>
						</button>
					);
				})}
			{isTripsError && (
				<span className="text-red-500">{isTripsError}</span>
			)}
			<button
				className="ml-auto block rounded-xl py-2 px-4 mt-3 text-white bg-maincolor hover:bg-maindarkcolor"
				onClick={handleCloneClick}
			>
				Clone
			</button>
		</div >
	);
}
