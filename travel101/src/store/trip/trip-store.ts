import { fetchCreateTrip, fetchSaveTrip, fetchUpdateTrip, fetchScriptTrip, fetchDeleteTrip } from '@/api/trip/tripApi';
import { TripStore, Trip, Day, Location, SelectedLocation, TripOwnerSnippet, Country } from '@/types/trip/tripStoreTypes';
import { create } from 'zustand';

// 날짜 범위에 따라 days 배열을 초기화하는 헬퍼 함수
const initializeDays = (startDate: Date, endDate: Date): Day[] => {
	const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	return Array.from({ length: dayCount }, (_, index) => ({
		number: index + 1,
		locations: [],
	}));
};

export const useTripStore = create<TripStore>((set, get) => ({
	trip: null,
	isOwner: false,
	tripOwner: null,
	selectedDay: 1,
	location: null,
	isLoading: false,
	searchQuery: null,

	setTrip: (trip: Trip) => set({ trip }),

	setIsOwner: (isOwner: boolean) => set({ isOwner }),

	setTripOwner: (tripOwner: TripOwnerSnippet) => set({ tripOwner }),

	setIsLoading: (loading: boolean) => set({ isLoading: loading }),

	// PATCH 요청으로 부분 업데이트
	updateTrip: async (updates: Partial<Trip>) => {
		const trip = get().trip;
		if (!trip || !trip.tripUid) {
			console.error("No trip or trip ID available to update");
			return;
		}

		set({ isLoading: true });
		try {
			const updatedTrip = await fetchUpdateTrip(trip.tripUid, updates);
			if (updatedTrip) {
				set({ trip: { ...trip, ...updatedTrip } }); // 백엔드 응답으로 상태 동기화
			}
		} catch (error) {
			console.error("Failed to update trip:", error);
		} finally {
			set({ isLoading: false });
		}
	},

	setTripName: (name: string) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, name } : null,
		})),

	setSelectedDay: (day: number) => set((state) => ({ ...state, selectedDay: day })),

	setDates: (startDate: Date, endDate: Date) =>
		set((state) => {
			if (!state.trip) return state;

			const { days } = state.trip;
			const newDays = initializeDays(startDate, endDate); // 기존 함수 유지

			// ✅ 기존 데이터를 유지하면서 새로운 days 배열 생성
			const updatedDays = newDays.map((newDay, index) => {
				return days[index] ? { ...days[index] } : newDay;
			});

			// ✅ 날짜가 줄어든 경우 → 삭제된 날들의 데이터를 새로운 마지막 날로 이동
			if (newDays.length < days.length) {
				const removedDays = days.slice(newDays.length); // 삭제될 날짜들
				const lastNewDayIndex = newDays.length - 1; // 새로운 마지막 날의 index

				updatedDays[lastNewDayIndex] = {
					...updatedDays[lastNewDayIndex], // 기존 마지막 날 데이터 유지
					locations: [
						...updatedDays[lastNewDayIndex].locations, // 기존 locations 유지
						...removedDays.flatMap((day, index) =>
							day.locations.map((location) => ({
								...location,
								number: updatedDays[lastNewDayIndex].locations.length + index + 1, // **새로운 number로 재정렬**
							}))
						),
					],
				};
			}

			return {
				trip: { ...state.trip, startDate, endDate, days: updatedDays },
			};
		}),

	addDay: () =>
		set((state) => {
			if (!state.trip) return state;
			const newDay = { number: state.trip.days.length + 1, locations: [] };
			const newEndDate = new Date(state.trip.endDate);
			newEndDate.setDate(newEndDate.getDate() + 1);
			return {
				trip: {
					...state.trip,
					endDate: newEndDate,
					days: [...state.trip.days, newDay]
				},
			};
		}),

	removeDay: (dayIndex: number) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length) return state;

			const removedDay = state.trip.days[dayIndex]; // 삭제된 날
			const updatedDays = state.trip.days.filter((_, index) => index !== dayIndex);
			const reorderedDays = updatedDays.map((day, index) => ({
				...day,
				number: index + 1,
			}));

			// ✅ 삭제되는 마지막 날의 데이터를 이전 마지막 날에 추가
			if (removedDay.locations.length > 0) {
				const moveTargetIndex = dayIndex === 0 ? 0 : dayIndex - 1;
				reorderedDays[moveTargetIndex] = {
					...reorderedDays[moveTargetIndex],
					locations: [
						...reorderedDays[moveTargetIndex].locations,
						...removedDay.locations.map((location, index) => ({
							...location,
							number: reorderedDays[moveTargetIndex].locations.length + index + 1, // **number 재정렬**
						})),
					],
				};
			}

			let newEndDate = new Date(state.trip.endDate);
			newEndDate.setDate(newEndDate.getDate() - 1);

			return {
				trip: {
					...state.trip,
					endDate: newEndDate,
					days: reorderedDays,
				},
			};
		}),

	// map search query
	setSearchQuery: (query: string) => set({ searchQuery: query }),

	// add location btn search query
	searchLocation: () => {
		const search = prompt('Search Location:');
		set({ searchQuery: search });
	},

	setLocation: (loc: Partial<Location>) => {
		set({ location: loc });
	},

	addLocation: (dayIndex: number, loc: Partial<Location>, selectedLoc: SelectedLocation) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length) return state;

			// 새로운 Location 객체 생성
			const newLocation: Location = {
				number: state.trip.days[dayIndex].locations.length + 1, // 기존 위치 수 + 1
				name: loc.name ?? '',
				longitude: loc.longitude ?? null,
				latitude: loc.latitude ?? null,
				description: '', // 기본값
			};

			const updatedDays = [...state.trip.days];
			updatedDays[dayIndex] = {
				...updatedDays[dayIndex],
				locations: [...updatedDays[dayIndex].locations, newLocation],
			};

			let updatedCountries = state.trip.countries;
			console.log("before updatedCountries: ", updatedCountries)
			const country = selectedLoc.country;
			console.log("updating country: ", country)
			if (country) {
				const iso2 = typeof country === 'string' ? country : country;
				const countryExists = updatedCountries.some(c => c.iso2 === iso2);
				if (!countryExists) {
					const countryToAdd: Country =
						typeof country === 'string'
							? {
								iso2: country,
								name: null,
								flag: null
							}
							: country;

					updatedCountries = [...updatedCountries, countryToAdd];
				}
			}

			console.log("updatedCountries: ", updatedCountries)
			return {
				trip: {
					...state.trip,
					days: updatedDays,
					countries: updatedCountries,
				},
			};
		}),

	updateLocation: (dayIndex: number, locIndex: number, location: Location) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length || locIndex >= state.trip.days[dayIndex].locations.length)
				return state;
			const updatedDays = [...state.trip.days];
			updatedDays[dayIndex].locations[locIndex] = location;
			return {
				trip: { ...state.trip, days: updatedDays },
			};
		}),

	removeLocation: (dayIndex: number, locIndex: number) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length) return state;
			const updatedDays = [...state.trip.days];

			// 🗑️ 해당 위치 제거 후 number 재정렬
			updatedDays[dayIndex].locations = updatedDays[dayIndex].locations
				.filter((_, index) => index !== locIndex)
				.map((location, newIndex) => ({
					...location,
					number: newIndex + 1, // 📌 number를 1부터 다시 매김
				}));

			return {
				trip: { ...state.trip, days: updatedDays },
			};
		}),

	setDescription: (dayIndex: number, locIndex: number, description: string) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length || locIndex >= state.trip.days[dayIndex].locations.length)
				return state;
			const updatedDays = [...state.trip.days];
			updatedDays[dayIndex].locations[locIndex] = {
				...updatedDays[dayIndex].locations[locIndex],
				description: description,
			};
			return {
				trip: { ...state.trip, days: updatedDays },
			};
		}),

	setTotalCost: (totalCost: bigint) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, totalCost } : null,
		})),

	setIsCompleted: (isCompleted: boolean) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, isCompleted } : null,
		})),

	// setCountries: (countries: string[]) =>
	// 	set((state) => ({
	// 		trip: state.trip ? { ...state.trip, countries } : null,
	// 	})),
}));

// ... may need functions that tracks changes
// changedFields: new Set(),
// addChangedField: (field) => set((state) => ({ changedFields: new Set(state.changedFields).add(field) })),
// clearChangedFields: () => set({ changedFields: new Set() }),