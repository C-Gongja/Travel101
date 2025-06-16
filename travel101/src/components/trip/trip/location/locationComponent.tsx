"use client";

import { Draggable } from "@hello-pangea/dnd";
import { MdDeleteOutline } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { Location } from "@/types/trip/tripStoreTypes";
import Modal from "@/components/ui/modal/MainModal";
import { CloneLocation } from "../clone/CloneLocation";
import LocationHeader from "./LocationHeader";
import LocationDescription from "./LocationDescription";
import LocationMedia from "./LocationMedia";
import { S3Location } from "@/types/S3/trip/S3TripTypes";

interface LocationProps {
	location: Location;
	dayIndex: number;
	locIndex: number;
	isLast: boolean;
}

const LocationComponent: React.FC<LocationProps> = ({
	location,
	dayIndex,
	locIndex,
	isLast,
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [lineHeight, setLineHeight] = useState<number>(0);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { isOwner, setDescription, removeLocation, updateLocationMedia } = useTripStore();
	const [isCloneOpen, setIsCloneOpen] = useState(false);
	const [cloneDayNum, setCloneDayNum] = useState(0);
	const [cloneLocNum, setCloneLocNum] = useState(0);

	const handleLocCloneClick = (dayNum: number, locNum: number) => {
		setIsCloneOpen(true)
		setCloneDayNum(dayNum + 1);
		setCloneLocNum(locNum);
	}

	useEffect(() => {
		const handler = setTimeout(() => {
			if (contentRef.current && !isLast) {
				const height = contentRef.current.offsetHeight;
				setLineHeight(height);
			}
		}, 10); // 100ms 지연

		return () => clearTimeout(handler); // 클린업
	}, [location, isLast]); // location이나 isLast가 변경될 때마다 높이 재계산

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			// 높이를 먼저 초기화 (scrollHeight 정확히 측정 위해)
			textarea.style.height = 'auto';
			// 내용 높이에 맞춰 설정
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [location.description]); // description이 변경될 때마다 실행

	return (
		<Draggable
			key={`location-${dayIndex}-${locIndex}`}
			draggableId={`location-${dayIndex}-${locIndex}`}
			index={locIndex}
			isDragDisabled={!isOwner}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					// {...provided.dragHandleProps}
					className={`flex flex-col space-y-2 mt-2 p-2 bg-white relative ${snapshot.isDragging ? "bg-blue-200" : "transition duration-200"
						}`}
				>
					{/* 상단 가로 정렬 섹션 */}
					<div className="flex items-start justify-between space-x-2">
						{/* 동그라미와 선 */}
						<div className="relative flex items-center">
							<div className="w-3 h-3 bg-maincolor rounded-full mr-2" />
							{!isLast && (
								<div
									className="absolute rounded-md left-[5px] top-4 w-[2px] bg-maincolor"
									style={{ height: `${lineHeight - 10}px` }}
								/>
							)}
						</div>

						{/* 장소 이름, 복제 버튼, 설명 (LocationHeader와 LocationDescription) */}
						<div ref={contentRef} className="flex flex-col flex-grow" {...provided.dragHandleProps}
						>
							<LocationHeader
								locationName={location.name}
								onCloneClick={() => handleLocCloneClick(dayIndex, location.number)}
							/>
							<LocationDescription
								description={location.description}
								isOwner={isOwner}
								dayIndex={dayIndex}
								locIndex={locIndex}
								setDescription={setDescription}
							/>
						</div>

						{/* 삭제 버튼 */}
						<button
							onClick={() => removeLocation(dayIndex, locIndex)}
							className={`w-8 h-8 text-red-500 rounded-full flex items-center justify-center hover:border hover:border-red-500 transition duration-200
                                ${!isOwner ? "hidden" : ""}`}
						>
							<MdDeleteOutline size={18} />
						</button>
					</div>

					{/* media 섹션 */}
					<LocationMedia
						media={location.media || []} // 이미 존재하는 미디어 URL (Pre-signed or S3 Key)
						setMedia={(newMediaArray) => updateLocationMedia(dayIndex, locIndex, newMediaArray)}
						dayIndex={dayIndex} // Day index 추가
						locIndex={locIndex} // Location index 추가
					/>

					{isCloneOpen && (
						<Modal isOpen={isCloneOpen} onClose={() => setIsCloneOpen(false)}>
							<CloneLocation dayNum={cloneDayNum} locNum={cloneLocNum} />
						</Modal>
					)}
				</div>
			)}
		</Draggable>
	);
};

export default LocationComponent;