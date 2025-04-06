'use client'

import { useState } from "react";
import { useTripStore } from "@/app/store/createTrip/trip-store";
import { IoIosAddCircle } from "react-icons/io";

interface AddLocationModalProps {
	onClose: () => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ onClose }) => {
	const { trip, location, addLocation } = useTripStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// addLocation 호출 후 모달 닫기
	const handleAddLocation = (dayIndex: number) => {
		try {
			setIsLoading(true);
			addLocation(dayIndex, location); // 위치 추가
			onClose(); // 성공 시 모달 닫기
		} catch (err) {
			setError("Failed to add location");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center w-[420px]">
			<h1>{trip.name}</h1>
			<h2>Add to</h2>
			<div className="flex flex-row gap-6 mt-5">
				{trip?.days.map((day, dayIndex) => (
					<div
						key={dayIndex}
						onClick={() => handleAddLocation(dayIndex)} // 클릭 시 handleAddLocation 호출
						className="flex flex-row items-center gap-2 py-2 px-3 text-maincolor border border-maincolor rounded-full transform-all 
            hover:cursor-pointer hover:bg-maincolor hover:text-white"
					>
						<span>Day {day.number}</span>
						<IoIosAddCircle className="text-xl" />
					</div>
				))}
			</div>
			{isLoading && <p>Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}

export default AddLocationModal;