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
	username: string; // or userId, or both
	parentUid: string | null;
	createdAt: Date;
	childCount: number;
}

export interface CommentsProps {
	tripComments: CommentProps[];
}

export interface FetchCommentOptions {
	targetType: string;
	targetUid: string;
}

