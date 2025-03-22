import { fetchCreateTrip } from '@/app/api/trip/tripApi';
import { create } from 'zustand';

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
	address: string;
	description: string;
}

interface TripStore {
	trip: Trip | null;
	isLoading: boolean;
	setTrip: (trip: Trip) => void;
	createTrip: () => void; // 페이지 진입 시 초기화
	updateTripName: (name: string) => void;
	updateDates: (startDate: Date, endDate: Date) => void; // 날짜 설정 및 days 업데이트
	addDay: () => void;
	removeDay: (dayIndex: number) => void;
	addLocation: (dayIndex: number) => void;
	updateLocation: (dayIndex: number, locIndex: number, location: Location) => void;
	updateDescription: (dayIndex: number, locIndex: number, description: string) => void;
	removeLocation: (dayIndex: number, locIndex: number) => void;
	updateTotalCost: (totalCost: bigint) => void;
	updateIsCompleted: (isCompleted: boolean) => void;
	updateCountries: (countries: string[]) => void;
	setIsLoading: (loading: boolean) => void;
}

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
	isLoading: false,

	setTrip: (trip: Trip) => set({ trip }),

	setIsLoading: (loading: boolean) => set({ isLoading: loading }),

	createTrip: async () => {
		set({ isLoading: true });
		try {
			const today = new Date();
			const defaultEndDate = new Date(today);
			defaultEndDate.setDate(today.getDate() + 2);

			const newTrip: Trip = {
				name: 'New Trip',
				startDate: today,
				endDate: defaultEndDate,
				days: initializeDays(today, defaultEndDate),
				scripted: 0,
				isCompleted: false,
				countries: [],
			};
			set({ trip: newTrip });

			// need to be refactor
			const currentTrip = get().trip;
			if (!currentTrip) {
				throw new Error("Trip is null after setting newTrip");
			}

			console.log("create trip: ", currentTrip);
			const trip = await fetchCreateTrip(currentTrip);

			// ✅ trip이 올바르게 반환되었는지 확인 후 localStorage에 저장
			if (trip && trip.id) {
				localStorage.setItem("tripId", trip.id);
			}
		} catch (error) {
			console.error("Error creating trip: ", error);
		} finally {
			set({ isLoading: false });
		}
	},

	updateTripName: (name: string) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, name } : null,
		})),

	updateDates: (startDate: Date, endDate: Date) =>
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

	addLocation: (dayIndex: number) =>
		set((state) => {
			if (!state.trip || dayIndex >= state.trip.days.length) return state;
			// 사용자로부터 locationName 입력받기 (필요에 따라 커스터마이징 가능)
			const name = prompt('장소 이름을 입력하세요:');
			if (!name) return state; // 입력이 없으면 상태 변경 없음

			// 새로운 Location 객체 생성
			const newLocation: Location = {
				number: state.trip.days[dayIndex].locations.length + 1, // 기존 위치 수 + 1
				name,
				address: '', // 기본값
				description: '', // 기본값
			};

			const updatedDays = [...state.trip.days];
			updatedDays[dayIndex] = {
				...updatedDays[dayIndex],
				locations: [...updatedDays[dayIndex].locations, newLocation],
			};

			return {
				trip: { ...state.trip, days: updatedDays },
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
			updatedDays[dayIndex].locations = updatedDays[dayIndex].locations.filter(
				(_, index) => index !== locIndex
			);
			return {
				trip: { ...state.trip, days: updatedDays },
			};
		}),

	updateDescription: (dayIndex: number, locIndex: number, description: string) =>
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

	updateTotalCost: (totalCost: bigint) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, totalCost } : null,
		})),

	updateIsCompleted: (isCompleted: boolean) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, isCompleted } : null,
		})),

	updateCountries: (countries: string[]) =>
		set((state) => ({
			trip: state.trip ? { ...state.trip, countries } : null,
		})),
}));
