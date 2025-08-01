import { fetchUpdateTrip } from '@/api/trip/tripApi';
import { TripStore, Trip, Day, Location, SelectedLocation, TripOwnerSnippet, Country } from '@/types/trip/tripStoreTypes';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
	isLoading: false,
	searchQuery: null,

	setTrip: (trip: Trip) => set({ trip }),

	setIsOwner: (isOwner: boolean) => set({ isOwner }),

	setTripOwner: (tripOwner: TripOwnerSnippet) => set({ tripOwner }),

	updateTripOwner: (key, value) => set((state) => ({
		tripOwner: state.tripOwner ? { ...state.tripOwner, [key]: value } : null
	})),

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

	addLocation: (dayIndex: number, selectedLoc: SelectedLocation) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length) return state;

			const newLocation: Location = {
				number: state.trip.days[dayIndex].locations.length + 1,
				name: selectedLoc.name ?? '',
				longitude: selectedLoc.longitude ?? null,
				latitude: selectedLoc.latitude ?? null,
				description: '',
				countryIso2: selectedLoc.countryIso2 ?? '',
			};

			const updatedDays = [...state.trip.days];
			updatedDays[dayIndex] = {
				...updatedDays[dayIndex],
				locations: [...updatedDays[dayIndex].locations, newLocation],
			};

			let updatedCountries = state.trip.countries;
			// console.log("before updatedCountries: ", updatedCountries)
			const country = selectedLoc.countryIso2;
			// console.log("updating country: ", country)
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

			// console.log("updatedCountries: ", updatedCountries)
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

	updateLocationMedia: (dayIndex, locIndex, newMedia) =>
		set((state) => {
			if (!state.trip) return state;
			const updatedDays = state.trip.days.map((day, dIdx) => {
				if (dIdx === dayIndex) {
					return {
						...day,
						locations: day.locations.map((loc, lIdx) =>
							lIdx === locIndex ? { ...loc, media: newMedia } : loc
						),
					};
				}
				return day;
			});
			return {
				trip: {
					...state.trip,
					days: updatedDays,
				},
			};
		}),

	removeLocation: (dayIndex: number, locIndex: number) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length) return state;
			// 전체 day 복사가 필요한 것인가 아니지 location이 remove된 것만 바꾸면됨
			const updatedDays = [...state.trip.days];

			// 🗑️ 해당 위치 제거 후 number 재정렬
			updatedDays[dayIndex].locations = updatedDays[dayIndex].locations
				.filter((_, index) => index !== locIndex)
				.map((location, newIndex) => ({
					...location,
					number: newIndex + 1, // 📌 number를 1부터 다시 매김
				}));

			// 🌎 사용된 iso2만 수집
			const usedIso2s = updatedDays
				.flatMap((day) => day.locations.map((loc) => loc.countryIso2))
				.filter((iso2): iso2 is string => !!iso2); // null/undefined 제거

			const usedIso2Set = new Set(usedIso2s);

			// 🧹 실제로 사용 중인 국가만 유지
			const updatedCountries = state.trip.countries.filter((country) =>
				usedIso2Set.has(country.iso2)
			);

			return {
				trip: { ...state.trip, days: updatedDays, countries: updatedCountries, },
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
	// ✨ 새로운 여행 초기화 로직
	initializeNewTrip: () =>
		set((state) => {
			const now = new Date();
			// 날짜를 ISO 8601 문자열로 저장하는 것이 더 일관적일 수 있습니다.
			// 백엔드와 프론트엔드 간 Date 객체 직렬화/역직렬화 문제가 발생할 경우 문자열로 변경 고려.
			// 여기서는 일단 Date 객체로 유지.
			const tomorrow = new Date(now);
			tomorrow.setDate(now.getDate() + 1);
			const newDays = initializeDays(now, tomorrow);

			return { // 새로운 상태 객체를 반환
				trip: {
					tripUid: `temp-${uuidv4()}`,
					name: "New Trip",
					startDate: now,
					endDate: tomorrow,
					days: newDays,
					isLiked: false,
					scripted: 0,
					likesCount: 0,
					scriptedCount: 0,
					commentsCount: 0,
					completed: false,
					countries: [],
				},
				isOwner: true,
			};
		}),
	resetTripStore: () =>
		set(() => ({
			trip: null,
			isOwner: false,
		})),
}));

// ... may need functions that tracks changes
// changedFields: new Set(),
// addChangedField: (field) => set((state) => ({ changedFields: new Set(state.changedFields).add(field) })),
// clearChangedFields: () => set({ changedFields: new Set() }),