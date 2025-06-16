import { Country } from "./tripStoreTypes";

export interface TripCardProps {
	tripUid: string;
	name: string;
	username: string;
	likesCount: number;
	scriptedCount: number;
	commentsCount: number;
	startDate: string;
	endDate: string;
	countries: Country[];
	media?: string[];
}

export interface TripCardListProps {
	trip: TripCardProps;
}
