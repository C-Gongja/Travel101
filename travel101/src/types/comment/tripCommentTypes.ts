export interface CommentRequestProps {
	targetUid: string;
	content: string;
	targetType: string;
	parentUid: string | null;
}

export interface CommentUpdateProps {
	uid: string;
	targetType: string;
	targetUid: string;
	parentUid: string | null;
	content: string;
}

export interface CommentProps {
	uid: string;
	content: string;
	picture: string;
	username: string; // or userId, or both
	userUid: string;
	parentUid: string | null;
	createdAt: Date;
	liked: boolean,
	likesCount: number,
	childCount: number;
}

export interface CommentsProps {
	tripComments: CommentProps[];
}

export interface FetchCommentOptions {
	targetType: string;
	targetUid: string;
}

