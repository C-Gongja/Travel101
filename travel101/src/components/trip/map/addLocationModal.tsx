'use client'

import { useState } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { IoIosAddCircle } from "react-icons/io";
import { SelectedLocation } from "@/types/trip/tripStoreTypes";

interface AddLocationModalProps {
	selectedPlace: SelectedLocation;
	onClose: () => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ selectedPlace, onClose }) => {
	const { trip, addLocation } = useTripStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// addLocation 호출 후 모달 닫기
	const handleAddLocation = (dayIndex: number) => {
		try {
			setIsLoading(true);
			console.log("selected Place:", selectedPlace);
			if (!selectedPlace) return;
			addLocation(dayIndex, selectedPlace); // 위치 추가
			onClose();
		} catch (err) {
			setError("Failed to add location");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col p-3 gap-5 w-[420px]">
			<div className="flex flex-col items-center justify-center gap-5">
				<span className="ml-6 text-3xl">Add</span>
				<span className="text-xl font-bold">"{selectedPlace.name}"</span>
			</div>
			<div className="flex flex-row items-center justify-center gap-6 mt-5">
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