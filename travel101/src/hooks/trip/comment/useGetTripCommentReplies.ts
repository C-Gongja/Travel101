import { getTripCommentsReplies } from "@/api/trip/comment/tripCommentApi";
import { useQuery } from "@tanstack/react-query";

export const useGetTripCommentReplies = (parentUid: string, options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ["trip_comment_replies", parentUid],
		queryFn: async () => {
			const response = await getTripCommentsReplies(parentUid);
			return response;
		},
		enabled: options?.enabled ?? true,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};