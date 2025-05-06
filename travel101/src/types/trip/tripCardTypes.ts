import { Country } from "./tripStoreTypes";

export interface TripCardProps {
	tripUid: string;
	name: string;
	username: string;
	scripted: number;
	startDate: string;
	endDate: string;
	countries: Country[];
}

export interface TripCardListProps {
	trip: TripCardProps;
}
