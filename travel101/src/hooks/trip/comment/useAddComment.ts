import { addCommentApi } from "@/api/trip/comment/tripCommentApi";
import { TripCommentRequestProps } from "@/types/trip/comment/tripCommentTypes";
import { useMutation } from "@tanstack/react-query";

export const useAddComment = () => {
	const addTripCommentMutation = useMutation({
		mutationFn: async (newComment: TripCommentRequestProps) => {

			if (!newComment?.tripUid) {
				throw new Error("No trip provided or trip ID is missing");
			}
			const savedComment = await addCommentApi(newComment);
			return savedComment;
		}
	});
	return {
		addComment: addTripCommentMutation.mutate, // 수정된 Trip을 인자로 받을 수 있음
		isSaving: addTripCommentMutation.isPending, // isLoading 대신 isPending 사용 (React Query 권장)
		error: addTripCommentMutation.error,
	};
};