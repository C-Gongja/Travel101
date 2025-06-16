export interface S3LocationRequest {
	tripUid: string;
	dayNum: number;
	locNum: number;
	files: File[];
}

export interface S3Location {
	ownerUid: string;
	s3Key: string;
	presignedUrl: string;
}