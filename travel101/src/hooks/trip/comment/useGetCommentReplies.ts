import { getCommentsReplies } from "@/api/trip/comment/tripCommentApi";
import { useQuery } from "@tanstack/react-query";

export const useGetCommentReplies = (parentUid: string, options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ["trip_comment_replies", parentUid],
		queryFn: async () => {
			const response = await getCommentsReplies(parentUid);
			return response;
		},
		enabled: options?.enabled ?? true,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};