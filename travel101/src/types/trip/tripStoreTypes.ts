export interface Trip {
	tripUid: string;
	name: string;
	startDate: Date;
	endDate: Date;
	days: Day[];
	createdAt?: string;
	isLiked: boolean;
	scripted: number;
	likesCount: number;
	scriptedCount: number;
	commentsCount: number;
	completed: boolean;
	countries: Country[];
}

// 백엔드 응답 Trip 인터페이스
export interface TripResponse {
	trip: Trip;
	userSnippet: TripOwnerSnippet;
	editable: boolean;
}

// 백엔드 요청 Trip 인터페이스
export interface TripRequest {
	tripUid: string;
	name: string;
	startDate: string; // 또는 Date
	endDate: string; // 또는 Date
	days: Day[];
	scripted: number;
	completed: boolean;
	countries: CountryRequest[]; // 백엔드로 보내는 형태
}

// 프론트엔드에서 사용할 통합 Country 인터페이스
export interface Country {
	name: string | null;
	iso2: string;
	flag: string | null;
}

// 백엔드 응답에서 오는 Country 데이터 구조
export interface CountryResponse {
	name: string;
	iso2: string;
	flag: string;
}

// 백엔드 요청에 필요한 Country 데이터 구조
export interface CountryRequest {
	iso2: string;
}

export interface Day {
	number: number;
	locations: Location[];
}

export interface Location {
	number: number;
	name: string;
	longitude: number;
	latitude: number;
	description: string;
	countryIso2: string;
}

export interface SelectedLocation {
	name?: string;
	address?: string;
	place_id?: string;
	longitude: number;
	latitude: number;
	countryIso2?: string;
}

export interface TripOwnerSnippet {
	name: string;
	username: string;
	uuid: string;
	isFollowing: boolean;
}

export interface TripStore {
	trip: Trip | null;
	isOwner: boolean; // 새로운 속성 추가
	tripOwner: TripOwnerSnippet | null;
	isLoading: boolean;
	searchQuery: string | null;
	selectedDay: number;
	// location: Partial<Location> | null;
	setTrip: (trip: Trip) => void;
	setIsOwner: (editable: boolean) => void;
	setTripOwner: (tripOwner: TripOwnerSnippet) => void;
	updateTripOwner: <K extends keyof TripOwnerSnippet>(key: K, value: TripOwnerSnippet[K]) => void;
	updateTrip: (updates: Partial<Trip>) => Promise<void>;// partial update
	setTripName: (name: string) => void;
	setSelectedDay: (dayIndex: number) => void;
	setDates: (startDate: Date, endDate: Date) => void;
	addDay: () => void;
	removeDay: (dayIndex: number) => void;
	setSearchQuery: (query: string) => void;
	searchLocation: () => void;
	// setLocation: (loc: Partial<Location>) => void;
	addLocation: (dayIndex: number, selectedLoc: SelectedLocation) => void;
	updateLocation: (dayIndex: number, locIndex: number, location: Location) => void;
	removeLocation: (dayIndex: number, locIndex: number) => void;
	setDescription: (dayIndex: number, locIndex: number, description: string) => void;
	setTotalCost: (totalCost: bigint) => void;
	setIsCompleted: (completed: boolean) => void;
	// setCountries: (countries: string[]) => void;
	setIsLoading: (loading: boolean) => void;
}

// 어댑터 함수: 백엔드 응답을 프론트엔드 모델로 변환
export function adaptTripResponseToModel(response: Trip): Trip {
	return {
		...response,
		startDate: new Date(response.startDate),
		endDate: new Date(response.endDate),
		countries: response.countries.map(country => ({
			name: country.name,
			iso2: country.iso2,
			flag: country.flag
		}))
	};
}

// 어댑터 함수: 프론트엔드 모델을 백엔드 요청으로 변환
export function adaptTripModelToRequest(trip: Trip): TripRequest {
	return {
		tripUid: trip.tripUid,
		name: trip.name,
		startDate: trip.startDate.toISOString(), // 날짜 형식 변환
		endDate: trip.endDate.toISOString(), // 날짜 형식 변환
		days: trip.days,
		scripted: trip.scripted,
		completed: trip.completed,
		countries: trip.countries.map(country => ({
			iso2: country.iso2
		}))
	};
}

/**
 * Country 배열에 특정 iso2 코드가 있는지 확인
 * @param countries Country 배열
 * @param iso2 확인할 국가 코드
 * @returns 포함 여부 (boolean)
 */
export function hasCountryWithIso2(countries: Country[], iso2: string): boolean {
	return countries.some(country => country.iso2 === iso2);
}

/**
 * Country 배열에 새 국가 추가 (iso2가 이미 존재하면 추가하지 않음)
 * @param countries 기존 Country 배열
 * @param newCountry 추가할 새 국가 (전체 Country 객체 또는 iso2만 있는 객체)
 * @returns 업데이트된 Country 배열
 */
export function addCountryIfNotExists(
	countries: Country[],
	newCountry: Country | { iso2: string }
): Country[] {
	// 이미 해당 iso2를 가진 국가가 있는지 확인
	if (hasCountryWithIso2(countries, newCountry.iso2)) {
		return countries; // 이미 존재하면 원래 배열 반환
	}

	// 새 국가가 iso2만 가지고 있는 경우, 나머지 필드를 null로 채움
	const countryToAdd: Country = 'name' in newCountry ?
		newCountry as Country :
		{
			iso2: newCountry.iso2,
			name: null,
			flag: null
		};

	// 새 국가를 추가한 배열 반환
	return [...countries, countryToAdd];
}

/**
 * Country 배열에서 특정 iso2를 가진 국가 제거
 * @param countries Country 배열
 * @param iso2 제거할 국가 코드
 * @returns 업데이트된 Country 배열
 */
export function removeCountryByIso2(countries: Country[], iso2: string): Country[] {
	return countries.filter(country => country.iso2 !== iso2);
}

/**
 * Country 배열에서 특정 iso2를 가진 국가 정보 업데이트
 * @param countries Country 배열
 * @param iso2 업데이트할 국가 코드
 * @param updatedData 업데이트할 데이터 (부분적인 Country 객체)
 * @returns 업데이트된 Country 배열
 */
export function updateCountryByIso2(
	countries: Country[],
	iso2: string,
	updatedData: Partial<Country>
): Country[] {
	return countries.map(country =>
		country.iso2 === iso2 ? { ...country, ...updatedData } : country
	);
}