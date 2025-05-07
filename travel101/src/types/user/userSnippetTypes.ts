export interface UserSnippet {
	uuid: string;
	name: string;
	username: string;
	isFollowing: boolean;
}

export interface UserSnippetStore {
	userSnippet: UserSnippet | null;
	setUserSnippet: (userSnippet: UserSnippet) => void;
	updateUserSnippet: <K extends keyof UserSnippet>(key: K, value: UserSnippet[K]) => void;
}