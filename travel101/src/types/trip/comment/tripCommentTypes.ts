export interface TripCommentRequestProps {
	tripUid: string;
	userUid: string;
	content: string;
	targetType: string;
	parentUid: string | null;
}

export interface TripCommentProps {
	uid: string;
	content: string;
	username: string; // or userId, or both
	userUid: string;
	parentUid: string;
	createdAt: Date;
	childCount: number;
}

export interface TripAllCommentsProps {
	tripComments: TripCommentProps[];
}

export interface FetchCommentOptions {
	targetType: string;
	targetUid: string;
}