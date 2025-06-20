'use client'

import useScriptDay from "@/hooks/trip/useScriptDay";
import { useFetchUserTrips } from "@/hooks/tripList/useFetchUserTrips";
import { useTripStore } from "@/store/trip/trip-store";
import { useUserStore } from "@/store/user/user-store";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface CloneDayProps {
	cloneDayNum: number;
}

export const CloneDay = ({ cloneDayNum }: CloneDayProps) => {
	const { user } = useUserStore();
	const { trip } = useTripStore();
	const { data: tripList, isLoading: isTripsLoading, error: tripsError } = useFetchUserTrips(user?.uuid);
	const { scriptTripDay, isCloning, isSuccess: isScriptSuccess, error: scriptError } = useScriptDay();

	const [selectedTrip, setSelectedTrip] = useState<string>("");
	const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

	useEffect(() => {
		if (isScriptSuccess) {
			setMessage({ type: 'success', text: 'Successfully cloned!' });
			// 성공 후 추가 액션 (예: 폼 초기화, 모달 닫기 지연 등)
		} else if (scriptError) {
			setMessage({ type: 'error', text: scriptError.message || 'An unknown error occurred during cloning.' });
		}
	}, [isScriptSuccess, scriptError]);

	// Clone 버튼 클릭 시 메시지 초기화
	const handleClickTrip = (tripUid: string) => {
		console.log("click trip: ", tripUid);
		setSelectedTrip(tripUid);
		setMessage(null); // 다른 트립 선택 시 메시지 초기화
	}

	const handleCloneClick = async () => {
		if (!trip) {
			setMessage({ type: 'error', text: 'Current trip data is missing.' });
			return;
		}
		if (!selectedTrip) {
			setMessage({ type: 'error', text: 'Please select a destination trip.' });
			return;
		}

		setMessage(null); // 새로운 요청 전 메시지 초기화
		// resetScriptState(); // useScriptDay 훅의 상태 초기화 (mutation.reset())

		try {
			await scriptTripDay({
				tripUid: trip.tripUid,
				dayNum: cloneDayNum,
				targetTripUid: selectedTrip,
			});
			// 성공 메시지는 useEffect에서 처리됩니다.
		} catch (err) {
			// 에러 메시지는 useEffect에서 처리됩니다.
			console.error("Clone operation failed in component:", err);
		}
	};

	return (
		<div className="w-full max-w-[600px] min-w-[400px]">
			<h2 className="text-3xl text-center mb-5">{user?.username}'s Trip</h2>

			{isTripsLoading && <div className="text-center text-gray-500">Loading trips...</div>}
			{tripsError && ( // useFetchUserTrips의 에러 메시지
				<div className="text-red-500 text-center">Failed to load trips: {tripsError.message || 'Unknown error'}</div>
			)}

			{tripList && tripList.length > 0 ? (
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
				})
			) : (
				!isTripsLoading && !tripsError && <div className="text-center text-gray-500 mt-5">No trips found.</div>
			)}
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
					disabled={isCloning || !selectedTrip} // 복제 중이거나 선택된 트립이 없으면 비활성화
				>
					{isCloning ? 'Cloning...' : 'Clone'}
				</button>
			</div>
		</div>
	);
}
