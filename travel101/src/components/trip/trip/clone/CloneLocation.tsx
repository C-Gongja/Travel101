'use client'

import useScriptLocation from "@/hooks/trip/useScriptLocation";
import { useGetCloneTripList } from "@/hooks/tripList/useGetCloneTripList";
import { useTripStore } from "@/store/trip/trip-store";
import { useUserStore } from "@/store/user/user-store";
import { Location } from "@/types/trip/tripStoreTypes";
import clsx from "clsx";
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
	const { scriptTripLocation, isSaving, error: scriptError, isSuccess: isScriptSuccess } = useScriptLocation();

	const [openTripUid, setOpenTripUid] = useState<string | null>(null);
	const [selectedDay, setSelectedDay] = useState<{ tripUid: string, number: number } | null>(null);
	const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

	// 각 Day 버튼의 ref를 저장하는 map
	const dayRefs = useRef<Record<number, HTMLButtonElement | null>>({});

	useEffect(() => {
		if (isScriptSuccess) {
			setMessage({ type: 'success', text: 'Successfully cloned!' });
			// 성공 후 추가 액션 (예: 폼 초기화, 모달 닫기 지연 등)
		} else if (scriptError) {
			setMessage({ type: 'error', text: scriptError.message || 'An unknown error occurred during cloning.' });
		}
	}, [isScriptSuccess, scriptError]);

	useEffect(() => {
		if (tripList?.length) {
			setOpenTripUid(tripList[0].tripUid);
		}
	}, [tripList]);

	const handleClickTrip = (tripUid: string) => {
		setSelectedDay(null);
		setOpenTripUid(prev => (prev === tripUid ? null : tripUid));
		setMessage(null); // 다른 트립 선택 시 메시지 초기화
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

	const handleCloneClick = async () => {
		if (!trip) {
			setMessage({ type: 'error', text: 'Current trip data is missing.' });
			return;
		}
		if (!openTripUid) {
			setMessage({ type: 'error', text: 'Please select a destination trip.' });
			return;
		}
		if (!selectedDay) {
			setMessage({ type: 'error', text: 'Please select a destination day.' });
			return;
		}

		setMessage(null); // 새로운 요청 전 메시지 초기화
		// resetScriptState(); // useScriptDay 훅의 상태 초기화 (mutation.reset())
		try {
			await scriptTripLocation({
				tripUid: trip?.tripUid,
				dayNum: dayNum,
				locNum: locNum,
				targetTripUid: selectedDay?.tripUid,
				targetDayNum: selectedDay?.number
			});
			setSelectedDay(null);
			// 성공 메시지는 useEffect에서 처리됩니다.
		} catch (err) {
			// 에러 메시지는 useEffect에서 처리됩니다.
			console.error("Clone operation failed in component:", err);
		}

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
										.find(d => d.number === selectedDay?.number)
										?.locations?.map((loc: Location, idx: number) => (
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
			<div className="flex items-center">
				{message && (
					<span className={clsx("block text-center mt-3", {
						"text-green-500": message.type === 'success',
						"text-red-500": message.type === 'error',
					})}>
						{message.text}
					</span>
				)}
				<button
					className="ml-auto block rounded-xl py-2 px-4 mt-3 text-white bg-maincolor hover:bg-maindarkcolor disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={handleCloneClick}
					disabled={isSaving || !selectedDay} // 복제 중이거나 선택된 트립이 없으면 비활성화
				>
					{isSaving ? 'Cloning...' : 'Clone'}
				</button>
			</div>
		</div>
	);
};