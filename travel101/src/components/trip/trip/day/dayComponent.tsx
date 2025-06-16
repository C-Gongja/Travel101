"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaClone } from "react-icons/fa6";
import LocationComponent from "../location/locationComponent";
import { useTripStore } from "@/store/trip/trip-store";
import { Day } from "@/types/trip/tripStoreTypes";
import Modal from "@/components/ui/modal/MainModal";
import { CloneDay } from "../clone/CloneDay";

interface DraggableDayProps {
	day: Day;
	dayIndex: number;
}

const DayComponent: React.FC<DraggableDayProps> = ({ day, dayIndex }) => {
	const { isOwner, setSelectedDay, removeDay, searchLocation } = useTripStore();
	const [isCollapsed, setIsCollapsed] = useState(false); // 접힘 상태 관리
	const [isCloneOpen, setIsCloneOpen] = useState(false);
	const [cloneDayNum, setCloneDayNum] = useState(0);

	const toggleCollapse = () => {
		setIsCollapsed((prev) => !prev); // 접힘/펼침 토글
	};

	const handleCollapseClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			toggleCollapse();
		}
	};

	const handleDayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation(); // 헤더 클릭 이벤트로 전파 방지
		if (e.target === e.currentTarget) {
			console.log("selected day: ", day.number);
			setSelectedDay(day.number);
		}
	};

	const handleDayCloneClick = (dayNum: number) => {
		setIsCloneOpen(true);
		setCloneDayNum(dayNum);
		console.log("clone dayNum: ", dayNum);
	}

	return (
		<Draggable key={`day-${dayIndex}`} draggableId={`day-${dayIndex}`} index={dayIndex} isDragDisabled={!isOwner}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="p-4 bg-white"
				>
					{/* 헤더: 드래그 핸들, 제목, 접힘 버튼, 삭제 버튼 */}
					<div
						//여기에 dayIndex 
						onClick={handleDayClick}
						className="flex justify-between items-center cursor-pointer"
					>
						<div className="text-xl font-semibold flex items-center space-x-4">
							<span {...provided.dragHandleProps} className={`cursor-move ${!isOwner ? "hidden" : ""}`}>
								<RxHamburgerMenu />
							</span>
							<span {...provided.dragHandleProps}>Day {day.number}</span>
							<button
								onClick={() => handleDayCloneClick(day.number)}
								className="text-gray-500 hover:text-maincolor transition duration-200">
								<FaClone className="text-lg" />
							</button>
						</div>
						<div className="flex items-center space-x-2">
							<div
								onClick={handleCollapseClick}
								className="text-gray-600 hover:text-gray-800 transition duration-200 p-4"
							>
								{isCollapsed ? <FaChevronDown size={16} className="pointer-events-none" /> : <FaChevronUp size={16} className="pointer-events-none" />}
							</div>
							<button
								onClick={(e) => {
									removeDay(dayIndex);
								}}
								className={`w-8 h-8 text-red-500 rounded-full flex items-center justify-center hover:text-white hover:bg-red-500 transition duration-200
									${!isOwner ? "hidden" : ""}`}
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
								searchLocation();
							}}
							className="mt-2 px-4 py-2 rounded-lg flex items-center gap-2 text-maincolor hover:bg-maincolor hover:text-white transition duration-200"
						>
							<IoIosAddCircle className="text-xl" /> Location
						</button>
					</div>
					{isCloneOpen &&
						<Modal isOpen={isCloneOpen} onClose={() => setIsCloneOpen(false)}>
							<CloneDay cloneDayNum={cloneDayNum} />
						</Modal>
					}
				</div>
			)}
		</Draggable>
	);
};

export default DayComponent;