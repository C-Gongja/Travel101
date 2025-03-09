"use client";

import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DayComponent from "./dayComponent";
import { updateDaysOrder, updateLocationsOrder } from "@/app/lib/TripUtil";

export default function TripCustom() {
	const [days, setDays] = useState<Day[]>([{ dayNum: 1, locations: [] }]);

	const addDay = () => {
		setDays((prevDays) => [
			...prevDays,
			{ dayNum: prevDays.length + 1, locations: [] },
		]);
	};

	const removeDay = (dayIndex: number) => {
		const confirmDeletion = window.confirm('Are you sure you want to delete this day?');

		if (confirmDeletion) {
			setDays((prevDays) => prevDays.filter((_, index) => index !== dayIndex));
		}
	};

	const addLocation = (dayIndex: number) => {
		const newLocation = prompt("장소 이름을 입력하세요:");
		if (newLocation) {
			setDays((prevDays) => {
				const updatedDays = [...prevDays];
				updatedDays[dayIndex].locations.push(newLocation);
				return updatedDays;
			});
		}
	};

	const removeLocation = (dayIndex: number, locIndex: number) => {
		const confirmDeletion = window.confirm('Are you sure you want to delete this location?');

		if (confirmDeletion) {
			setDays((prevDays) => {
				const updatedDays = [...prevDays];
				updatedDays[dayIndex].locations = updatedDays[dayIndex].locations.filter(
					(_, index) => index !== locIndex
				);
				return updatedDays;
			});
		}
	};

	const onDragEnd = (result: any) => {
		const { source, destination, type } = result;

		if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
			return;
		}

		if (type === "day") {
			setDays(updateDaysOrder(days, source.index, destination.index));
		} else if (type === "location") {
			const sourceDayIndex = parseInt(source.droppableId, 10);
			const destDayIndex = parseInt(destination.droppableId, 10);

			if (sourceDayIndex === destDayIndex) {
				setDays(updateLocationsOrder(days, sourceDayIndex, source.index, destination.index));
			}
		}
	};

	return (
		<div className="p-6">

			<div className="flex flex-row items-center">
				<h1 className="text-4xl font-bold mr-3">Trip Name</h1>
				<button>
					<FiShare2 className="text-3xl" />
				</button>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="days" type="day">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="mt-4"
						>
							{days.map((day, dayIndex) => (
								<DayComponent
									key={`day-${dayIndex}`}
									day={day}
									dayIndex={dayIndex}
									removeDay={removeDay}
									addLocation={addLocation}
									removeLocation={removeLocation}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<button
				onClick={addDay}
				className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-maincolor hover:text-white transition duration-200"
			>
				<IoIosAddCircle className="text-xl" /> Day
			</button>
		</div>
	);
}