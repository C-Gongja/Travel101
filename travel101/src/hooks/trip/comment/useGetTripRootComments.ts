import { getTripRootComments } from "@/api/trip/comment/tripCommentApi";
import { FetchCommentOptions } from "@/types/trip/comment/tripCommentTypes";
import { useQuery } from "@tanstack/react-query";

export const useGetTripRootComments = (targetType: string, targetUid: string) => {
	const commentRequest: FetchCommentOptions = {
		targetType,
		targetUid
	};
	return useQuery({
		queryKey: ["trip_root_comments", targetUid],
		queryFn: async () => {
			const response = await getTripRootComments(commentRequest);
			return response;
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
	});
};