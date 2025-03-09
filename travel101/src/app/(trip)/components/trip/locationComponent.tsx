"use client";

import { Draggable } from "@hello-pangea/dnd";
import { MdDeleteOutline } from "react-icons/md";
import { useRef, useState, useEffect } from "react";

interface LocationProps {
	location: string;
	dayIndex: number;
	locIndex: number;
	removeLocation: (dayIndex: number, locIndex: number) => void;
	isLast: boolean;
}

const LocationComponent: React.FC<LocationProps> = ({
	location,
	dayIndex,
	locIndex,
	removeLocation,
	isLast,
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [lineHeight, setLineHeight] = useState<number>(0);

	useEffect(() => {
		if (contentRef.current && !isLast) {
			const height = contentRef.current.offsetHeight;
			setLineHeight(height + 0); // 장소 높이 + 다음 장소 간격(mt-2 ≈ 0.5rem ≈ 8px)
		}
	}, [location, isLast]); // location이나 isLast가 변경될 때마다 높이 재계산

	return (
		<Draggable
			key={`location-${dayIndex}-${locIndex}`}
			draggableId={`location-${dayIndex}-${locIndex}`}
			index={locIndex}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={`flex items-start justify-between space-x-2 mt-2 p-2 bg-white relative ${snapshot.isDragging ? "bg-blue-200" : "transition duration-200"
						}`}
				>
					{/* 동그라미와 선 */}
					<div className="relative flex items-center">
						<div className="w-3 h-3 bg-maincolor rounded-full mr-2" />
						{!isLast && (
							<div
								className="absolute rounded-md left-[5px] top-4 w-[2px] bg-maincolor"
								style={{ height: `${lineHeight}px` }} // 동적 높이 적용
							/>
						)}
					</div>

					{/* 장소 정보 */}
					<div ref={contentRef} className="flex flex-col flex-grow">
						<div className="font-semibold">Location Name</div>
						<div className="text-gray-600">Location Address</div>
						<div className="text-gray-500 text-sm">ㅁㄴ음나ㅡ이므나ㅣㅇㅁㄴ
							ㅇㄴㅁㄹ ㅁㄹㄴ멀몽ㄴ ㅍ어누펑ㄴ푸ㅏㄴ무푸어ㅣ뉘
							ㅇㄹㄴㅇㅁ
							ㄹㅇㅁㄴ
							ㄹㅇㄴㅁㄹㄴㅇㄹㄴㅁㅇㄹ  ㅙㄴㅇ로앤ㄹ ㅓ노러 론ㅇ ㅏ로ㅓ노럼 너ㅏㄹ홈냐ㅗ혀ㅑ모호며ㅑㄹ
						</div>
					</div>

					{/* 삭제 버튼 */}
					<button
						onClick={() => removeLocation(dayIndex, locIndex)}
						className="text-red-500 hover:text-red-700"
					>
						<MdDeleteOutline size={18} />
					</button>
				</div>
			)}
		</Draggable>
	);
};

export default LocationComponent;