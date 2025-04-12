import { TripCardProps } from "../trip/tripCardTypes";

export interface TripSearchProps {
	searchedTrips: TripCardProps[] | null;
	setSearchedTrips: (searchedTrips: TripCardProps[]) => void;
}
