import { getRootComments } from "@/api/comment/CommentApi";
import { FetchCommentOptions } from "@/types/comment/tripCommentTypes";
import { useQuery } from "@tanstack/react-query";

export const useGetRootComments = (targetType: string, targetUid: string) => {
	const commentRequest: FetchCommentOptions = {
		targetType,
		targetUid,
	};
	return useQuery({
		queryKey: ['rootComments', targetType, targetUid], // 개선된 key
		queryFn: () => getRootComments(commentRequest),
		refetchOnWindowFocus: true, // 브라우저 다시 활성화 시 refetch
	});
};