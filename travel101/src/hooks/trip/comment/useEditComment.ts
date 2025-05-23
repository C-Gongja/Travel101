import { CommentUpdateProps, CommentProps, CommentRequestProps } from "@/types/trip/comment/tripCommentTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentApi } from "@/api/trip/comment/tripCommentApi";
import { useUserStore } from "@/store/user/user-store";

export const useEditComment = () => {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	console.log("udpate comment");

	const updateCommentMutation = useMutation({
		mutationFn: updateCommentApi,

		onMutate: async (updateComment: CommentUpdateProps) => {
			// cancel 관련 쿼리들
			const rootQueryKey = ['rootComments', updateComment.targetType, updateComment.targetUid];
			const replyQueryKey = updateComment.parentUid ? ['commentReplies', updateComment.parentUid] : null;

			await Promise.all([
				queryClient.cancelQueries({ queryKey: rootQueryKey }),
				replyQueryKey ? queryClient.cancelQueries({ queryKey: replyQueryKey }) : Promise.resolve(),
			]);

			// 이전 데이터 저장
			const previousRootData = queryClient.getQueryData<CommentProps[]>(rootQueryKey);
			const previousReplyData = replyQueryKey ? queryClient.getQueryData<CommentProps[]>(replyQueryKey) : null;

			const tempUid = `temp-${Date.now()}`; // 안정적인 temp uid
			const optimisticComment: CommentProps = {
				uid: tempUid,
				content: updateComment.content,
				username: user?.username ?? 'user', // 백엔드에서 실제 사용자명 반환
				parentUid: updateComment.parentUid,
				createdAt: new Date(),
				childCount: 0,
			};

			// 낙관적 업데이트 - 루트 댓글
			if (!updateComment.parentUid) {
				queryClient.setQueryData(rootQueryKey, (old: CommentProps[] = []) =>
					old.map(c => (c.uid === updateComment.uid ? { ...c, updateComment } : c))
				);
			}

			// 낙관적 업데이트 - 대댓글
			if (updateComment.parentUid && replyQueryKey) {
				queryClient.setQueryData(replyQueryKey, (old: CommentProps[] = []) =>
					old.map(c => (c.uid === updateComment.uid ? { ...c, updateComment } : c))
				);
			}

			return { previousRootData, previousReplyData, rootQueryKey, replyQueryKey };
		},

		onSuccess: (updatedComment, variables) => {
			const rootQueryKey = ['rootComments', variables.targetType, variables.targetUid];
			const replyQueryKey = updatedComment.parentUid ? ['commentReplies', updatedComment.parentUid] : null;

			// 서버에서 온 최신 데이터로 덮어쓰기
			queryClient.setQueryData(rootQueryKey, (old: CommentProps[] = []) =>
				old.map(c => (c.uid === variables.uid ? updatedComment : c))
			);

			if (replyQueryKey) {
				queryClient.setQueryData(replyQueryKey, (old: CommentProps[] = []) =>
					old.map(c => (c.uid === variables.uid ? updatedComment : c))
				);
			}
		},

		onError: (error, variables, context) => {
			if (context?.previousRootData && context?.rootQueryKey) {
				queryClient.setQueryData(context.rootQueryKey, context.previousRootData);
			}
			if (context?.previousReplyData && context?.replyQueryKey) {
				queryClient.setQueryData(context.replyQueryKey, context.previousReplyData);
			}
		}
	});

	return {
		updateComment: updateCommentMutation.mutate,
		isSaving: updateCommentMutation.isPending,
		error: updateCommentMutation.error,
		isSuccess: updateCommentMutation.isSuccess,
		data: updateCommentMutation.data,
	};
};