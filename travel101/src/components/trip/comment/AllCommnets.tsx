import { TripCommentProps } from "@/types/trip/comment/tripCommentTypes";
import { CommentItem } from "./CommentItem";

interface AllCommentsProps {
	tripUid: string;
	targetType: string;
	rootComments: TripCommentProps[];
	isLoading: boolean;
}

export const AllComments = ({ tripUid, targetType, rootComments, isLoading }: AllCommentsProps) => {
	if (isLoading) return <p className="text-gray-500 px-4">Loading comments...</p>;

	return (
		<div className="space-y-4">
			{rootComments?.length > 0 ? (
				rootComments.map((comment) => (
					<CommentItem key={comment.uid} tripUid={tripUid} comment={comment} targetType={targetType} />
				))
			) : (
				<p className="px-4 text-gray-500">No comments yet.</p>
			)}
		</div>
	);
};