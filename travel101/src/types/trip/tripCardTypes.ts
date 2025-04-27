export interface TripCardProps {
	tripUid: string;
	name: string;
	username: string;
	scripted: number;
	startDate: string;
	endDate: string;
	countries: string[];
}

export interface TripCardListProps {
	trip: TripCardProps;
}
