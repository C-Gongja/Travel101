import { CommentProps } from "@/types/comment/tripCommentTypes";
import { CommentItem } from "./CommentItem";
import { CommentSectionProps } from "./CommentSection";
import { useEffect } from "react";

interface AllCommentsProps extends CommentSectionProps {
	rootComments: CommentProps[] | undefined;
	isLoading: boolean;
}

export const AllComments = ({ targetUid, targetType, rootComments, isLoading }: AllCommentsProps) => {
	if (isLoading) return <p className="text-gray-500 px-4">Loading comments...</p>;

	return (
		<div className="space-y-4">
			{rootComments?.length ? (
				rootComments.map((comment) => (
					<CommentItem
						key={comment.uid}
						targetUid={targetUid}
						comment={comment}
						targetType={targetType}
					/>
				))
			) : (
				<p className="px-4 text-gray-500">No comments yet.</p>
			)}
		</div>
	);
};