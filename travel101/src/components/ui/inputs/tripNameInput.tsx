import { useTripStore } from "@/store/trip/trip-store";
import useByteLengthInput from "@/hooks/char-hooks";
import { useEffect } from "react";

const TripNameInput = ({ maxByteLength }: { maxByteLength?: number }) => {
	const { value, width, setValue } = useByteLengthInput(maxByteLength);
	const { trip, isOwner, updateTripName, } = useTripStore();

	const handleTripNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isOwner) return;
		setValue(e.target.value);
		updateTripName(e.target.value);
	};

	useEffect(() => {
		console.log("width: ", width);
	}, [width])

	return (
		<input
			type="text"
			value={trip?.name || ""}
			onChange={handleTripNameChange}
			style={{ width, transition: "width 0.2s ease-in-out" }} // Smooth width adjustment
			placeholder="New Name"
			className="text-4xl font-bold p-2 outline-none"
		/>
	);
};

export default TripNameInput 