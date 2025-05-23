import { getCommentsReplies } from "@/api/trip/comment/tripCommentApi";
import { useQuery } from "@tanstack/react-query";

export const useGetCommentReplies = (parentUid: string, options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ['commentReplies', parentUid],
		queryFn: () => getCommentsReplies(parentUid),
		enabled: options?.enabled ?? true,
		refetchOnWindowFocus: true,
	});
};