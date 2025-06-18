import { S3Location } from "../S3/trip/S3TripTypes";
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
	media?: S3Location[];
}

export interface TripCardListProps {
	trip: TripCardProps;
}
