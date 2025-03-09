const updateDaysOrder = (days: Day[], sourceIdx: number, destIdx: number): Day[] => {
	const newDays = [...days];
	const [movedDay] = newDays.splice(sourceIdx, 1);
	newDays.splice(destIdx, 0, movedDay);
	return newDays.map((day, index) => ({ ...day, dayNum: index + 1 }));
};

const updateLocationsOrder = (days: Day[], dayIdx: number, sourceIdx: number, destIdx: number): Day[] => {
	const newDays = [...days];
	const newLocations = [...newDays[dayIdx].locations];
	const [movedLocation] = newLocations.splice(sourceIdx, 1);
	newLocations.splice(destIdx, 0, movedLocation);
	newDays[dayIdx].locations = newLocations;
	return newDays;
};

export { updateDaysOrder, updateLocationsOrder };