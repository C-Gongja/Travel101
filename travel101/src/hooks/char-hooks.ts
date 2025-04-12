import { useTripStore } from "@/store/trip/trip-store";
import { useState, useEffect } from "react";

const getByteLength = (text: string): number => {
	let byteLength = 0;
	for (let i = 0; i < text.length; i++) {
		const charCode = text.charCodeAt(i);
		if (charCode <= 0x007f) {
			byteLength += 1; // ASCII (English, numbers, basic symbols)
		} else if (charCode <= 0x07ff) {
			byteLength += 2; // Some non-Latin scripts
		} else if (charCode <= 0xffff) {
			byteLength += 3; // CJK, Arabic, Hebrew, etc.
		} else {
			byteLength += 4; // Emoji, rare symbols
		}
	}
	return byteLength;
};

const useByteLengthInput = (maxByteLength: number) => {
	const [value, setValue] = useState("");
	const [width, setWidth] = useState("auto");
	const { trip, isOwner, updateTripName, } = useTripStore();

	useEffect(() => {
		const byteLength = getByteLength(value);

		// Limit input if it exceeds maxByteLength
		if (byteLength > maxByteLength) {
			let newValue = "";
			let currentByteLength = 0;

			for (let char of value) {
				const charByte = getByteLength(char);
				if (currentByteLength + charByte > maxByteLength) break;
				newValue += char;
				currentByteLength += charByte;
			}

			setValue(newValue);
		}

		// Set dynamic width (min width to prevent collapse)
		setWidth(`${Math.max(byteLength * 8, 100)}px`); // 8px per byte (adjustable)
	}, [value, maxByteLength]);

	return { value, setValue, width };
};


export default useByteLengthInput;