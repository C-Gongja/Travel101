export interface Trip {
	tripUid: string;
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

export interface SelectedLocation {
	name?: string;
	address?: string;
	place_id?: string;
	country?: string;
}

export interface TripOwnerSnippet {
	name: string;
	username: string;
	uuid: string;
}

export interface TripStore {
	trip: Trip | null;
	isOwner: boolean; // 새로운 속성 추가
	tripOwner: TripOwnerSnippet | null;
	isLoading: boolean;
	searchQuery: string | null;
	selectedDay: number;
	location: Partial<Location> | null;
	setTrip: (trip: Trip) => void;
	setIsOwner: (editable: boolean) => void;
	setTripOwner: (tripOwner: TripOwnerSnippet) => void;
	updateTrip: (updates: Partial<Trip>) => Promise<void>;// partial update
	setTripName: (name: string) => void;
	setSelectedDay: (dayIndex: number) => void;
	setDates: (startDate: Date, endDate: Date) => void;
	addDay: () => void;
	removeDay: (dayIndex: number) => void;
	setSearchQuery: (query: string) => void;
	searchLocation: () => void;
	setLocation: (loc: Partial<Location>) => void;
	addLocation: (dayIndex: number, loc: Partial<Location>, selectedLoc: SelectedLocation) => void;
	updateLocation: (dayIndex: number, locIndex: number, location: Location) => void;
	removeLocation: (dayIndex: number, locIndex: number) => void;
	setDescription: (dayIndex: number, locIndex: number, description: string) => void;
	setTotalCost: (totalCost: bigint) => void;
	setIsCompleted: (isCompleted: boolean) => void;
	setCountries: (countries: string[]) => void;
	setIsLoading: (loading: boolean) => void;
}