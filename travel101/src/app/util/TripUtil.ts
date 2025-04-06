import { Day } from "../store/createTrip/trip-store";

const updateDaysOrder = (days: Day[], sourceIdx: number, destIdx: number): Day[] => {
	const newDays = [...days];
	const [movedDay] = newDays.splice(sourceIdx, 1);
	newDays.splice(destIdx, 0, movedDay);
	return newDays.map((day, index) => ({ ...day, number: index + 1 }));
};

const updateLocationsOrder = (days: Day[], dayIdx: number, sourceIdx: number, destIdx: number): Day[] => {
	const newDays = [...days];
	const newLocations = [...newDays[dayIdx].locations];

	// 🔹 1️⃣ 이동할 location 찾기
	const [movedLocation] = newLocations.splice(sourceIdx, 1);

	// 🔹 2️⃣ 새로운 위치에 삽입
	newLocations.splice(destIdx, 0, movedLocation);

	// 🔹 3️⃣ number를 재정렬
	newDays[dayIdx].locations = newLocations.map((location, index) => ({
		...location,
		number: index + 1, // 🔥 새 index에 맞게 number 업데이트
	}));

	return newDays;
};

export { updateDaysOrder, updateLocationsOrder };