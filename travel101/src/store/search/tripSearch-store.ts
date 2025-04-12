import { TripSearchProps } from '@/types/search/tripSearchTypes';
import { TripCardProps } from '@/types/trip/tripCardTypes';
import { create } from 'zustand';

export const useTripSearchStore = create<TripSearchProps>((set, get) => ({
	searchedTrips: [],
	setSearchedTrips: (searchedTrips: TripCardProps[]) => set({ searchedTrips }),

}));