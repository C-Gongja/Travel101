type Region = string;

interface Day {
	dayNum: number;
	locations: Region[];
}

interface DraggableDayProps {
	day: Day;
	dayIndex: number;
	removeDay: (index: number) => void;
	addLocation: (dayIndex: number) => void;
	removeLocation: (dayIndex: number, locIndex: number) => void;
}