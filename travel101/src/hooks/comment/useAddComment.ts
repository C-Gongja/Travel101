
import { addCommentApi } from "@/api/comment/CommentApi";
import { useUserStore } from "@/store/user/user-store";
import { CommentProps, CommentRequestProps } from "@/types/comment/tripCommentTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddComment = () => {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	console.log("add comment");

	const addCommentMutation = useMutation({
		mutationFn: addCommentApi,
		onMutate: async (newComment: CommentRequestProps) => {
			const queryKey = newComment.parentUid
				? ['commentReplies', newComment.parentUid]
				: ['rootComments', newComment.targetType, newComment.targetUid];

			await queryClient.cancelQueries({ queryKey });

			const previousData = queryClient.getQueryData(queryKey);
			const tempUid = `temp-${Date.now()}`; // 안정적인 temp uid

			const optimisticComment: CommentProps = {
				uid: tempUid,
				content: newComment.content,
				username: user?.username ?? 'user', // 백엔드에서 실제 사용자명 반환
				parentUid: newComment.parentUid,
				createdAt: new Date(),
				liked: false,
				likesCount: 0,
				childCount: 0,
			};

			queryClient.setQueryData(queryKey, (old: CommentProps[] = []) =>
				[optimisticComment, ...old] // always add on the top
			);

			if (newComment.parentUid) {
				queryClient.setQueryData(
					['rootComments', newComment.targetType, newComment.targetUid],
					(old: CommentProps[] = []) =>
						old.map((c) =>
							c.uid === newComment.parentUid ? { ...c, childCount: c.childCount + 1, hasReplies: true } : c
						)
				);
			}

			return { previousData, queryKey, tempUid };
		},
		onSuccess: (data, variables, context) => {
			const queryKey = context?.queryKey;
			const tempUid = context?.tempUid;

			if (!queryKey || !tempUid) return;

			queryClient.setQueryData(queryKey, (old: CommentProps[] = []) =>
				old.map((c) => (c.uid === tempUid ? data : c))
			);
		},
		onError: (error, variables, context) => {
			if (!context) return;

			queryClient.setQueryData(context.queryKey, context.previousData);

			if (variables.parentUid) {
				queryClient.setQueryData(
					['rootComments', variables.targetType, variables.targetUid],
					(old: CommentProps[] = []) =>
						old.map((c) =>
							c.uid === variables.parentUid
								? { ...c, childCount: c.childCount - 1, hasReplies: c.childCount > 1 }
								: c
						)
				);
			}

		},
	});

	return {
		addComment: addCommentMutation.mutate,
		isSaving: addCommentMutation.isPending,
		error: addCommentMutation.error,
		isSuccess: addCommentMutation.isSuccess,
		data: addCommentMutation.data,
	};
};