import { CommentEditProps } from "@/types/trip/comment/tripCommentTypes";
import { useMutation } from "@tanstack/react-query";
import { editCommentApi } from "@/api/trip/comment/tripCommentApi";

export const useEditComment = () => {
	const editCommentMutation = useMutation({
		mutationFn: async (comment: CommentEditProps) => {
			if (!comment?.commentUid) {
				throw new Error("No targetUid provided");
			}
			return await editCommentApi(comment);
		},
	});

	return {
		editComment: editCommentMutation.mutate,
		isSaving: editCommentMutation.isPending,
		error: editCommentMutation.error,
	};
};
