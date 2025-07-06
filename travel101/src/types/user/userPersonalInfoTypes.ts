export interface UserPersonalInfo {
	uuid: string;
	name: string;
	picture: string;
	username: string;
	email: string;
	country?: string;
	bio?: string;
	socialLinks?: SocialLink[]
}

export interface SocialLink {
	platform: string;
	url: string;
}

export interface UserPersonalInfoStore {
	personalInfo: UserPersonalInfo | null;
	setPersonalInfo: (personalInfo: UserPersonalInfo) => void;
	updateField: <K extends keyof UserPersonalInfo>(key: K, value: UserPersonalInfo[K]) => void;
}