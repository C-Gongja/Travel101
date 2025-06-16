// components/LocationMediaSaveBtn.tsx
import { useS3MediaUpload } from '@/hooks/media/tripMedia/useUploadMedia';
import { S3Location } from '@/types/S3/trip/S3TripTypes';
import React from 'react';

// LocationMediaSaveBtn에 필요한 props 정의
interface LocationMediaSaveBtnProps {
	tripUid: string; // 현재 Trip의 UID
	dayIndex: number;
	locIndex: number;
	filesToUpload: File[]; // 업로드할 File 객체 배열
	// isMediaChanged: boolean; // 미디어 변경 여부를 나타내는 플래그 (선택 사항, 아래 설명 참조)
	onSaveSuccess: (uploadedMedia: S3Location[]) => void; // !!! 새로 추가된 콜백 prop !!!
	onSaveError: (error: Error) => void; // 선택 사항: 에러 처리 콜백
}

const LocationMediaSaveBtn: React.FC<LocationMediaSaveBtnProps> = ({
	tripUid,
	dayIndex,
	locIndex,
	filesToUpload,
	// isMediaChanged,
	onSaveSuccess, // !!! 구조 분해 할당 !!!
	onSaveError, // 선택 사항
}) => {
	// useS3MediaUpload 훅 호출
	// 이제 tripUid, dayIndex, locIndex를 props로 받아 사용합니다.
	const { saveS3MediaMutation, isSaving, error, isSuccess, data } = useS3MediaUpload({
		tripUid,
		dayIndex,
		locIndex,
	});

	React.useEffect(() => {
		if (isSuccess && data) {
			// 업로드가 성공하면 부모 컴포넌트(LocationMedia)에 알립니다.
			onSaveSuccess(data); // `data`는 업로드된 S3Location[]입니다.
		}
		if (error) {
			onSaveError(error); // 에러 발생 시 부모 컴포넌트에 알립니다.
		}
	}, [isSuccess, data, error, onSaveSuccess, onSaveError]);

	// const handleSaveSuccess = (uploadedMedia: S3Location[]) => {
	// 	// 부모 컴포넌트의 media 상태를 업데이트합니다.
	// 	// 기존 media에서 임시 optimistic- 키를 가진 항목들을 제거하고,
	// 	// 새로 업로드된 실제 S3Location 정보를 추가합니다.
	// 	const currentMediaWithoutOptimistic = media.filter(m => !m.s3Key.startsWith('optimistic-'));
	// 	setMedia([...currentMediaWithoutOptimistic, ...uploadedMedia]);

	// 	// 로컬 미리보기와 filesToUpload 상태 초기화
	// 	localPreviewUrls.forEach(url => URL.revokeObjectURL(url));
	// 	setLocalPreviewUrls([]);
	// 	setFilesToUpload([]);

	// 	alert("미디어가 성공적으로 업로드되었습니다!");
	// };

	const handleMediaSave = () => {
		console.log("filesToUpload: ", filesToUpload);
		if (filesToUpload.length === 0) {
			alert("업로드할 새로운 미디어가 없습니다.");
			return;
		}

		const requestData = {
			files: filesToUpload,
			tripUid: tripUid,
			dayNum: dayIndex + 1,
			locNum: locIndex + 1,
		};

		// React Query mutate 함수 호출
		saveS3MediaMutation(requestData);
		console.log("data: ", data)
	};

	const isButtonDisabled = filesToUpload.length === 0 || isSaving;

	return (
		<button
			onClick={handleMediaSave}
			className={`py-1 px-3 rounded-full transition-colors duration-200 
                  ${isButtonDisabled
					? 'bg-gray-300 text-gray-500 cursor-not-allowed'
					: 'bg-green-500 text-white hover:bg-green-600'
				}`}
			disabled={isButtonDisabled}
		>
			{isSaving ? 'Saving...' : 'Save'}
		</button>
	);
};

export default LocationMediaSaveBtn;