export interface Trip {
	id?: string;
	name: string;
	startDate: Date;
	endDate: Date;
	days: Day[];
	createdAt?: string;
	scripted: number;
	isCompleted: boolean;
	countries: string[];
}

export interface Day {
	number: number;
	locations: Location[];
}

export interface Location {
	number: number;
	name: string;
	longitude: number | null;
	latitude: number | null;
	description: string;
}

export interface TripStore {
	trip: Trip | null;
	isOwner: boolean; // 새로운 속성 추가
	isLoading: boolean;
	searchQuery: string | null;
	selectedDay: number;
	location: Partial<Location> | null;
	setTrip: (trip: Trip) => void;
	setIsOwner: (editable: boolean) => void;
	createTrip: () => void; // 페이지 진입 시 초기화
	scriptTrip: () => void;
	saveTrip: (trip: Trip) => Promise<void>;
	updateTrip: (updates: Partial<Trip>) => Promise<void>;// partial update
	deleteTrip: () => void;
	updateTripName: (name: string) => void;
	setSelectedDay: (dayIndex: number) => void;
	updateDates: (startDate: Date, endDate: Date) => void;
	addDay: () => void;
	removeDay: (dayIndex: number) => void;
	setSearchQuery: (query: string) => void;
	searchLocation: () => void;
	setLocation: (loc: Partial<Location>) => void;
	addLocation: (dayIndex: number, loc: Partial<Location>) => void;
	updateLocation: (dayIndex: number, locIndex: number, location: Location) => void;
	updateDescription: (dayIndex: number, locIndex: number, description: string) => void;
	removeLocation: (dayIndex: number, locIndex: number) => void;
	updateTotalCost: (totalCost: bigint) => void;
	updateIsCompleted: (isCompleted: boolean) => void;
	updateCountries: (countries: string[]) => void;
	setIsLoading: (loading: boolean) => void;
}