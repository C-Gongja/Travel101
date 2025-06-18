import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trip } from "@/types/trip/tripStoreTypes";
import { S3Location, S3LocationRequest } from "@/types/S3/trip/S3TripTypes";
import { useUserStore } from "@/store/user/user-store";
import { useTripStore } from "@/store/trip/trip-store";
import { uploadMedia } from "@/api/aws-s3/s3Api";

interface UseS3MediaUploadProps {
	tripUid: string; // 현재 Trip의 UID (context 또는 prop으로 받아야 함)
	dayIndex: number;
	locIndex: number;
}

export const useS3MediaUpload = ({ tripUid, dayIndex, locIndex }: UseS3MediaUploadProps) => {
	// queryClient는 더 이상 필요 없음
	const { trip, updateLocationMedia } = useTripStore(); // Trip 상태와 업데이트 함수
	const { user } = useUserStore();

	const s3MediaUploadMutation = useMutation({
		mutationFn: uploadMedia,
		onMutate: async (newMediaRequest: S3LocationRequest) => {
			if (!user?.uuid) {
				throw new Error("User must be authenticated to upload media.");
			}
			const ownerId = user.uuid;

			// --- 낙관적 업데이트 로직 시작 (Zustand 직접 업데이트) ---
			// 현재 Zustand 스토어의 Trip 상태에서 해당 Location의 media를 가져옵니다.
			const currentTripState = trip; // trip은 이미 Zustand 상태이므로 복사할 필요 없음
			let previousLocationMedia: S3Location[] = []; // 롤백을 위한 이전 미디어 상태

			if (currentTripState) {
				const targetDay = currentTripState.days[dayIndex];
				if (targetDay) {
					const targetLocation = targetDay.locations[locIndex];
					if (targetLocation) {
						previousLocationMedia = [...(targetLocation.media || [])]; // 이전 미디어 스냅샷 저장

						// 낙관적으로 추가될 미디어 정보 생성
						const optimisticMedia: S3Location[] = newMediaRequest.files.map(file => ({
							ownerUid: ownerId,
							s3Key: `optimistic-${file.name}-${Date.now()}`, // 임시 키 생성
							presignedUrl: URL.createObjectURL(file), // 로컬 미리보기 URL 사용
						}));

						// Zustand 스토어의 `updateLocationMedia` 액션을 사용하여 낙관적으로 업데이트
						// 이 액션은 새로운 미디어 배열을 받아서 해당 위치의 media를 업데이트해야 합니다.
						// 기존 media에서 optimisticMedia를 추가한 새 배열을 전달합니다.
						const newMediaForStore = [...previousLocationMedia, ...optimisticMedia];
						updateLocationMedia(dayIndex, locIndex, newMediaForStore);
					}
				}
			}
			// --- 낙관적 업데이트 로직 끝 ---

			// onError에서 롤백을 위해 이전 미디어 데이터를 컨텍스트로 반환
			return { previousLocationMedia };
		},

		// 업로드 성공 시
		onSuccess: (uploadedS3Locations: S3Location[], variables, context) => {
			// Zustand 스토어를 실제 데이터로 업데이트 (낙관적 업데이트 대체)
			// `updateLocationMedia`는 `dayIndex`, `locIndex`, `newMediaArray`를 받습니다.
			// 현재 `trip` 상태를 기반으로 업데이트 로직을 수행합니다.
			const currentTripState = trip; // 현재 Zustand 스토어의 trip 상태
			if (currentTripState) {
				const targetDay = currentTripState.days[dayIndex];
				if (targetDay) {
					const targetLocation = targetDay.locations[locIndex];
					if (targetLocation) {
						// 기존 미디어에서 낙관적 업데이트된 임시 미디어를 제외하고
						// 새로 업로드된 실제 S3 미디어 정보를 추가합니다.
						const mediaWithoutOptimistic = (targetLocation.media || []).filter(m => !m.s3Key.startsWith('optimistic-'));
						const finalMedia = [...mediaWithoutOptimistic, ...uploadedS3Locations];

						updateLocationMedia(dayIndex, locIndex, finalMedia);
					}
				}
			}
			console.log("on success uploadedS3Locations:", uploadedS3Locations);
			console.log("on success Zustand trip:", trip); // 업데이트된 trip 상태 확인
		},

		// 업로드 실패 시
		onError: (error, variables, context) => {
			// 에러 발생 시 이전 데이터로 롤백 (Zustand 스토어 롤백)
			if (context?.previousLocationMedia) {
				updateLocationMedia(dayIndex, locIndex, context.previousLocationMedia);
			}
			console.error('S3 미디어 업로드 실패:', error);
			alert(`미디어 업로드 실패: ${error.message}`);
		},
	});

	return {
		saveS3MediaMutation: s3MediaUploadMutation.mutate,
		isSaving: s3MediaUploadMutation.isPending,
		error: s3MediaUploadMutation.error,
		isSuccess: s3MediaUploadMutation.isSuccess,
		data: s3MediaUploadMutation.data,
	};
};