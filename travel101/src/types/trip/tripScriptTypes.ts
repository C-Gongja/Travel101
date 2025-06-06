export interface ScriptDay {
	tripUid: string;
	dayNum: number;
	targetTripUid: string;
}

export interface ScriptLocation {
	tripUid: string;
	dayNum: number;
	locNum: number;
	targetTripUid: string;
	targetDayNum: number;
}