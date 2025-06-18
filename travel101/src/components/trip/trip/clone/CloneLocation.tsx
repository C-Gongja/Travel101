'use client'

import useScriptLocation from "@/hooks/trip/useScriptLocation";
import { useGetCloneTripList } from "@/hooks/tripList/useGetCloneTripList";
import { useTripStore } from "@/store/trip/trip-store";
import { useUserStore } from "@/store/user/user-store";
import { LargeNumberLike } from "crypto";
import { useEffect, useRef, useState } from "react";


interface ClonLocationProps {
	dayNum: number;
	locNum: number;
}

export const CloneLocation = ({ dayNum, locNum }: ClonLocationProps) => {
	const { user } = useUserStore();
	const { trip } = useTripStore();
	// make separate api? or filter imcomplete trip here?
	const { data: tripList, isLoading: isTripsLoading, isError: isTripsError } = useGetCloneTripList(user?.uuid);
	const { scriptTripLocation } = useScriptLocation();

	const [openTripUid, setOpenTripUid] = useState<string | null>(null);
	const [selectedDay, setSelectedDay] = useState<{ tripUid: string, number: number } | null>(null);

	// 각 Day 버튼의 ref를 저장하는 map
	const dayRefs = useRef<Record<number, HTMLButtonElement | null>>({});

	useEffect(() => {
		if (tripList?.length) {
			setOpenTripUid(tripList[0].tripUid);
		}
	}, [tripList]);

	const handleClickTrip = (tripUid: string) => {
		setSelectedDay(null);
		setOpenTripUid(prev => (prev === tripUid ? null : tripUid));
	};

	const handleClickDay = (tripUid: string, number: number) => {
		setSelectedDay({ tripUid, number });

		// 선택된 Day를 중앙으로 스크롤
		setTimeout(() => {
			const el = dayRefs.current[number];
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
			}
		}, 100); // 렌더링 이후 실행
	};

	const handleCloneClick = () => {
		// set an Error
		if (!trip || !selectedDay)
			return;

		scriptTripLocation({
			tripUid: trip?.tripUid,
			dayNum: dayNum,
			locNum: locNum,
			targetTripUid: selectedDay?.tripUid,
			targetDayNum: selectedDay?.number
		});

		console.log("tripUid: ", trip?.tripUid);
		console.log("dayNum: ", dayNum);
		console.log("locNum: ", locNum);
		console.log("targetTripUid: ", selectedDay?.tripUid);
		console.log("targetdayNum: ", selectedDay?.number);
	}

	return (
		<div className=" w-[500px] max-h-[80vh] overflow-y-auto p-4">
			<h2 className="text-3xl text-center mb-5">{user?.username}'s Trip</h2>

			{tripList?.map((trip: any) => (
				<div key={trip.tripUid} className="mb-6 border rounded-lg">
					{/* Trip Header */}
					<button
						onClick={() => handleClickTrip(trip.tripUid)}
						className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
					>
						<span>{trip.name}</span>
						<span>{trip.startDate} - {trip.endDate}</span>
					</button>

					{openTripUid === trip.tripUid && (
						<div className="p-3 bg-white border-t">
							{/* Days Row */}
							<div className="relative">
								<div className="flex items-center justify-between mb-2">
									{/* Left Scroll Button */}
									<button
										onClick={() => {
											const container = document.getElementById("day-scroll");
											container?.scrollBy({ left: -150, behavior: "smooth" });
										}}
										className="px-2 text-lg"
									>
										←
									</button>

									<div
										id="day-scroll"
										className="flex overflow-x-auto gap-2 w-full px-2 scrollbar-hide scroll-smooth"
									>
										{trip.days?.map((day: any) => (
											<button
												key={day.number}
												ref={el => (dayRefs.current[day.number] = el)}
												onClick={() => handleClickDay(trip.tripUid, day.number)}
												className={`min-w-[70px] px-4 py-2 border rounded-lg shrink-0 ${selectedDay?.tripUid === trip.tripUid &&
													selectedDay?.number === day.number
													? "bg-blue-500 text-white"
													: "bg-gray-100 hover:bg-gray-200"
													}`}
											>
												Day {day.number}
											</button>
										))}
									</div>

									{/* Right Scroll Button */}
									<button
										onClick={() => {
											const container = document.getElementById("day-scroll");
											container?.scrollBy({ left: 150, behavior: "smooth" });
										}}
										className="px-2 text-lg"
									>
										→
									</button>
								</div>
							</div>

							{/* Locations */}
							{selectedDay?.tripUid === trip.tripUid && (
								<div className="mt-3 max-h-[150px] overflow-y-auto border-t pt-2">
									{trip.days
										.find(d => d.number === selectedDay.number)
										?.locations?.map((loc, idx) => (
											<div key={idx} className="py-1 border-b">
												{loc.name}
											</div>
										))}
								</div>
							)}
						</div>
					)}
				</div>
			))}
			<button
				className="ml-auto block rounded-xl py-2 px-4 mt-3 text-white bg-maincolor hover:bg-maindarkcolor"
				onClick={handleCloneClick}
			>
				Clone
			</button>
		</div>
	);
};