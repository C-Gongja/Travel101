
import { addLikesApi, removeLikesApi } from "@/api/likes/LikeApi";
import { useTripStore } from "@/store/trip/trip-store";
import { useUserStore } from "@/store/user/user-store";
import { LikesRequest } from "@/types/likes/likesTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAddLikesProps {
	isLiked: boolean;
	onToggleLike?: (newIsLiked: boolean) => void;
}

export const useLikes = ({ isLiked, onToggleLike }: UseAddLikesProps) => {
	const queryClient = useQueryClient();

	const addLikesMutation = useMutation({
		mutationFn: ({ targetType, targetUid }: LikesRequest) => {
			return isLiked
				? removeLikesApi(targetType, targetUid)
				: addLikesApi(targetType, targetUid);
		},
		onMutate: async ({ targetType, targetUid }) => {
			console.log('Mutating likes:', { targetType, targetUid, isLiked });
			return { previousIsLiked: isLiked };
		},
		onSuccess: (data, variables, context) => {
			console.log('Likes mutation success:', data);
			// 부모 컴포넌트에 상태 업데이트 요청
			if (onToggleLike) {
				onToggleLike(!context?.previousIsLiked);
			}
			// 필요 시 캐시 무효화
			// queryClient.invalidateQueries(['likes', variables.targetType, variables.targetUid]);
		},
		onError: (error) => {
			console.error('Likes mutation error:', error);
			// 에러 시 상태 변경 없음
			// unlike이면 다시 like로, like이면 unlike로
		},
	});

	return {
		mutateLikes: addLikesMutation.mutate,
		isSaving: addLikesMutation.isPending,
		error: addLikesMutation.error,
		isSuccess: addLikesMutation.isSuccess,
		data: addLikesMutation.data,
	};
};