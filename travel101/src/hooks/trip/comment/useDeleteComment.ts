import { deleteCommentApi } from "@/api/trip/comment/tripCommentApi";
import { CommentProps } from "@/types/trip/comment/tripCommentTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteComment = () => {
	const queryClient = useQueryClient();

	const deleteCommentMutation = useMutation({
		mutationFn: async (commentUid: string) => {
			await deleteCommentApi(commentUid);
		},

		onMutate: async (deletedCommentUid: string) => {
			// 기존 쿼리들 멈추기
			await queryClient.cancelQueries();

			// 저장해둔 쿼리 데이터 가져오기
			const allKeys = queryClient.getQueryCache().getAll().map(q => q.queryKey);

			// 댓글이 속한 리스트에서 optimistic하게 제거
			const previousData: Record<string, any> = {};

			for (const key of allKeys) {
				const data = queryClient.getQueryData<CommentProps[]>(key);
				if (Array.isArray(data)) {
					const match = data.find(comment => comment.uid === deletedCommentUid);
					if (match) {
						previousData[JSON.stringify(key)] = data;
						queryClient.setQueryData(key, data.filter(comment => comment.uid !== deletedCommentUid));
					}
				}
			}

			return { previousData };
		},

		onError: (err, deletedCommentUid, context) => {
			// 롤백 처리
			if (context?.previousData) {
				for (const [key, data] of Object.entries(context.previousData)) {
					queryClient.setQueryData(JSON.parse(key), data);
				}
			}
		},

		onSettled: () => {
			// 서버에서 재검증
			queryClient.invalidateQueries();
		}
	});

	return {
		deleteComment: deleteCommentMutation.mutate,
		isDeleting: deleteCommentMutation.isPending,
		error: deleteCommentMutation.error
	};
};