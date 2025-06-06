"use client";

import { useEffect, useRef, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaClone } from "react-icons/fa6";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DayComponent from "./dayComponent";
import DateComponent from "./dateComponent";
import { updateDaysOrder, updateLocationsOrder } from "@/util/TripDragDropUtil";
import { useTripStore } from "@/store/trip/trip-store";
import useSaveTrip from "@/hooks/trip/useSaveTrip";
import useDeleteTrip from "@/hooks/trip/useDeleteTrip";
import useScriptTrip from "@/hooks/trip/useScriptTrip";
import LikesButton from "@/components/ui/buttons/like/LikesButton";
import { useUserStore } from "@/store/user/user-store";

export default function TripCustom() {
	const {
		trip,
		isOwner,
		setTripName,
		addDay,
		setTrip,
	} = useTripStore();
	const { user } = useUserStore();
	const { saveTrip, isSaving, error } = useSaveTrip();
	const { deleteTrip, isLoading } = useDeleteTrip();
	const { scriptTrip } = useScriptTrip();
	const [value, setValue] = useState(trip?.name || "");
	const [inputWidth, setInputWidth] = useState(10);
	const [isLiked, setIsLiked] = useState(trip?.isLiked);
	const spanRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		console.log("trip: ", trip);
	}, [trip]);

	useEffect(() => {
		if (spanRef.current) {
			const width = spanRef.current.offsetWidth;
			setInputWidth(width + 20); // padding 조금 추가
		}
	}, [trip?.name]);

	const handleTripNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isOwner) return;
		setTripName(e.target.value);
	};

	const handleScript = async () => {
		if (!user || !trip) return;
		scriptTrip(trip.tripUid);
	};

	const handleSave = async () => {
		if (!isOwner || !trip) return; // 소유자가 아니면 저장 불가
		const updatedTrip = { ...trip }; // 예시 수정
		saveTrip(updatedTrip);
	};

	const onDragEnd = (result: any) => {
		const { source, destination, type } = result;
		if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
			return;
		}

		// There should be better way to control this. this method should be refactor.
		if (!trip || !isOwner) {
			console.error("Trip is null, cannot proceed with drag and drop.");
			return;
		}

		let updatedTrip = { ...trip };

		if (type === "day") {
			updatedTrip.days = updateDaysOrder(trip.days, source.index, destination.index);
		} else if (type === "location") {
			const sourceDayIndex = parseInt(source.droppableId, 10);
			const destDayIndex = parseInt(destination.droppableId, 10);

			if (sourceDayIndex === destDayIndex) {
				// ✅ 같은 day 내에서 순서 변경
				updatedTrip.days = updateLocationsOrder(trip.days, sourceDayIndex, source.index, destination.index);
			} else {
				// ✅ 다른 day로 이동
				let sourceDay = { ...trip.days[sourceDayIndex] };
				let destDay = { ...trip.days[destDayIndex] };

				// 🔹 1️⃣ 이동할 location 찾기
				const [movedLocation] = sourceDay.locations.splice(source.index, 1);

				// 🔹 2️⃣ 새로운 day의 원하는 위치에 삽입
				destDay.locations.splice(destination.index, 0, movedLocation);

				// 🔹 3️⃣ number 재정렬
				sourceDay.locations = sourceDay.locations.map((loc, index) => ({
					...loc,
					number: index + 1,
				}));

				destDay.locations = destDay.locations.map((loc, index) => ({
					...loc,
					number: index + 1,
				}));

				// 🔹 4️⃣ 상태 업데이트
				updatedTrip.days[sourceDayIndex] = sourceDay;
				updatedTrip.days[destDayIndex] = destDay;
			}
		}

		setTrip(updatedTrip);
	};

	if (isSaving) return (<div>Saving tripCustom...</div>);

	return (
		<div className="px-6 h-[calc(100vh-500px)]">
			<div className="flex justify-between items-center">
				<div className="flex items-center flex-row gap-2">
					<input
						onChange={(e) => {
							setValue(e.target.value);
							handleTripNameChange(e); // 너가 정의한 함수
						}}
						placeholder="Trip Name"
						value={trip?.name || ""}
						disabled={!isOwner}
						maxLength={20}
						style={{ width: `${inputWidth}px` }}
						className="text-4xl font-bold p-2 input-style outline-none"
					/>
					{/* 숨겨진 span (실제 길이 측정용) */}
					<span
						className="absolute invisible whitespace-pre pointer-events-none overflow-hidden"
						style={{
							height: 0,
							whiteSpace: "pre",
							visibility: "hidden",
							position: "absolute",
							padding: "0 8px", // input과 동일하게!
							fontSize: "2.25rem", // text-4xl
							fontWeight: "bold",
							fontFamily: "inherit",
						}}
						ref={spanRef}
					>
						{value || " "}
					</span>

					<div className="flex items-center gap-5">
						<div className='flex gap-2'>
							<div className="flex items-center gap-2 text-2xl">
								{(trip && isLiked !== undefined) &&
									<LikesButton targetType={"TRIP"} targetUid={trip?.tripUid} isLiked={isLiked} setIsLiked={setIsLiked} />
								}
							</div>
							<p className="text-lg">{trip?.likesCount || 0}</p>
						</div>
						<div className='flex gap-2'>
							<div className="flex items-center gap-2 text-xl">
								<button
									onClick={handleScript}
									className="text-gray-500 hover:text-maincolor transition duration-200"
									aria-label="Share trip"
								>
									<FaClone />
								</button>
							</div>
							<p className="text-lg">{trip?.scriptedCount || 0}</p>
						</div>
					</div>
				</div>
				{isOwner && (
					<button
						onClick={deleteTrip}
						className="w-8 h-8 text-red-500 rounded-full flex items-center justify-center hover:text-white hover:bg-red-500 transition duration-200"
						aria-label="Delete trip"
					>
						<MdDeleteOutline size={25} />
					</button>
				)}
			</div>

			<div className="mt-2 ml-1 text-lg text-gray-500">
				<DateComponent />
				{trip?.completed ? "completed" : "not"}
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="days" type="day">
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
							{trip?.days.map((day, dayIndex) => (
								<DayComponent key={`day-${dayIndex}`} day={day} dayIndex={dayIndex} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			{isOwner && (
				<div className="mt-4 gap-4">
					<button
						onClick={addDay}
						className="px-4 py-2 rounded-lg flex items-center gap-2 text-xl text-maincolor hover:bg-maincolor hover:text-white transition duration-200"
					>
						<IoIosAddCircle className="text-2xl" />
						Day
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 text-xl text-maincolor border border-maincolor rounded-md hover:bg-maincolor hover:text-white transition duration-200"
					>
						Save
					</button>
				</div>
			)}
		</div>
	);
}
