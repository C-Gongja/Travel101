import { deleteCommentApi } from "@/api/trip/comment/tripCommentApi";
import { useMutation } from "@tanstack/react-query";

export const useDeleteComment = () => {
	const addTripCommentMutation = useMutation({
		mutationFn: async (targetUid: string) => {
			if (!targetUid) {
				throw new Error("No trip provided or trip ID is missing");
			}
			await deleteCommentApi(targetUid);
		}
	});
	return {
		deleteComment: addTripCommentMutation.mutate, // 수정된 Trip을 인자로 받을 수 있음
		isSaving: addTripCommentMutation.isPending, // isLoading 대신 isPending 사용 (React Query 권장)
		error: addTripCommentMutation.error,
	};
};