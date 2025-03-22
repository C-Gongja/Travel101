"use client";

import { useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DayComponent from "./dayComponent";
import DateComponent from "./dateComponent";
import { updateDaysOrder, updateLocationsOrder } from "@/app/util/TripUtil";
import { useTripStore } from "@/app/components/stateManagement/createTrip/trip-store";

export default function TripCustom() {
	const {
		trip,
		isLoading,
		createTrip,
		updateTripName,
		addDay,
		removeDay,
		addLocation,
		removeLocation,
		setTrip
	} = useTripStore();

	const handleSave = () => {
		console.log("save trip: ", trip);
	}

	const handleTripNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateTripName(e.target.value);
	};

	const onDragEnd = (result: any) => {
		const { source, destination, type } = result;
		if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
			return;
		}

		// There should be better way to control this. this method should be refactor.
		if (!trip) {
			console.error("Trip is null, cannot proceed with drag and drop.");
			return;
		}

		let updatedTrip = { ...trip };
		console.log("onDrag: ", updatedTrip);

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

	if (isLoading) return (<div>Loading tipCustom...</div>); // trip이 없으면 렌더링 안 함

	return (
		<div className="p-6">
			<div className="flex flex-row items-center">
				<input
					onChange={handleTripNameChange}
					placeholder="Trip Name"
					value={trip?.name || ''}
					className="text-4xl font-bold w-auto min-w-[150px] p-2"
				/>
				<button className="hover:text-maincolor transition duration-200">
					<FiShare2 className="text-3xl" />
				</button>
			</div>

			<div className="mt-2 ml-1 text-lg text-gray-500">
				<DateComponent />
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="days" type="day">
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
							{trip?.days.map((day, dayIndex) => (
								<DayComponent
									key={`day-${dayIndex}`}
									day={day}
									dayIndex={dayIndex}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<button
				onClick={addDay}
				className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 text-xl text-maincolor hover:bg-maincolor hover:text-white transition duration-200"
			>
				<IoIosAddCircle className="text-2xl" />
				Day
			</button>

			<button
				onClick={handleSave}
				className="p-2 text-xl text-maincolor border border-maincolor rounded-md hover:bg-maincolor hover:text-white"
			>
				Save
			</button>
		</div>
	);
}
