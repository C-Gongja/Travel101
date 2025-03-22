"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import LocationComponent from "./locationComponent";
import { Day, useTripStore } from "@/app/components/stateManagement/createTrip/trip-store";

interface DraggableDayProps {
	day: Day;
	dayIndex: number;
}

const DayComponent: React.FC<DraggableDayProps> = ({ day, dayIndex }) => {
	const { removeDay, addLocation } = useTripStore();
	const [isCollapsed, setIsCollapsed] = useState(false); // 접힘 상태 관리

	const toggleCollapse = () => {
		setIsCollapsed((prev) => !prev); // 접힘/펼침 토글
	};

	const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// 버튼 클릭이 아닌 헤더 자체 클릭 시에만 토글
		if (e.target === e.currentTarget) {
			toggleCollapse();
		}
	};

	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation(); // 헤더 클릭 이벤트로 전파 방지
	};

	return (
		<Draggable key={`day-${dayIndex}`} draggableId={`day-${dayIndex}`} index={dayIndex}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="p-4 bg-white"
				>
					{/* 헤더: 드래그 핸들, 제목, 접힘 버튼, 삭제 버튼 */}
					<div
						onClick={handleHeaderClick}
						className="flex justify-between items-center cursor-pointer"
					>
						<div className="text-xl font-semibold flex items-center space-x-4">
							<span {...provided.dragHandleProps} className="cursor-move">
								<RxHamburgerMenu />
							</span>
							<span {...provided.dragHandleProps}>Day {day.number}</span>
							<button >
								<FiShare2 />
							</button>
						</div>
						<div className="flex items-center space-x-2">
							<div
								onClick={handleHeaderClick}
								className="text-gray-600 hover:text-gray-800 transition duration-200 p-4"
							>
								{isCollapsed ? <FaChevronDown size={16} /> : <FaChevronUp size={16} />}
							</div>
							<button
								onClick={(e) => {
									removeDay(dayIndex);
								}}
								className="w-8 h-8 text-red-500 rounded-full flex items-center justify-center hover:text-white hover:bg-red-500 transition duration-200"
							>
								<MdDeleteOutline size={20} />
							</button>
						</div>
					</div>

					{/* 접힘 상태에 따라 locations 표시 */}
					<div
						className={`ml-4 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
							}`}
					>
						<Droppable droppableId={`${dayIndex}`} type="location">
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps} className="ml-4 mt-2">
									{day.locations.length === 0 ? (
										<p className="text-gray-400">No locations added.</p>
									) : (
										day.locations.map((location, locIndex) => (
											<LocationComponent
												key={`location-${dayIndex}-${locIndex}`}
												location={location}
												dayIndex={dayIndex}
												locIndex={locIndex}
												isLast={locIndex === day.locations.length - 1}
											/>
										))
									)}
									{provided.placeholder}
								</div>
							)}
						</Droppable>

						<button
							onClick={(e) => {
								e.stopPropagation();
								addLocation(dayIndex);
							}}
							className="mt-2 px-4 py-2 rounded-lg flex items-center gap-2 text-maincolor hover:bg-maincolor hover:text-white transition duration-200"
						>
							<IoIosAddCircle className="text-xl" /> Location
						</button>
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default DayComponent;