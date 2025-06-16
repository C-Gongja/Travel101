import { Trip } from "@/types/trip/tripStoreTypes";
import { apiClient } from "../apiClient";
import { S3Location, S3LocationRequest } from "@/types/S3/trip/S3TripTypes";

const S3_BASE_URL = "http://localhost:8080/api/s3";
const S3_PUBLIC_URL = "http://localhost:8080/public/s3";

export const uploadMedia = async (data: S3LocationRequest): Promise<S3Location[]> => {
	const { files, tripUid, dayNum, locNum } = data;

	const formData = new FormData();
	// 모든 파일을 'file'이라는 이름으로 FormData에 추가합니다.
	// 백엔드의 @RequestParam("file") List<MultipartFile> files 에 대응됩니다.
	files.forEach(file => {
		formData.append('file', file);
		console.log("file FormData: ", file);
	});

	// apiClient는 axios 또는 fetch 기반의 헬퍼 함수라고 가정합니다.
	// URL에 PathVariable을 직접 넣어줍니다.
	const response = await apiClient(`${S3_BASE_URL}/upload/${tripUid}/${dayNum}/${locNum}`, {
		method: 'POST',
		body: formData,
		// 'Content-Type': 'multipart/form-data' 헤더는 FormData 사용 시 자동으로 설정됩니다.
	});

	return response;
};