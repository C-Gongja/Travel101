import { useUserStore } from "@/store/user/user-store";
import { useEffect, useState } from "react";
import { AddComment } from "./AddComment";
import { AllComments } from "./AllCommnets";
import { useGetRootComments } from "@/hooks/comment/useGetRootComments";
import { CommentProps } from "@/types/comment/tripCommentTypes";
import { useTripStore } from "@/store/trip/trip-store";

export type CommentSectionProps = {
	targetUid: string;
	targetType: string;
};

export const CommentSection = ({ targetType, targetUid }: CommentSectionProps) => {
	const { user, isAuthenticated } = useUserStore();
	const { trip } = useTripStore();

	if (!targetUid) return null; // 또는 로딩 처리, 에러 메시지 등

	const { data: rootComments, isLoading } = useGetRootComments(targetType, targetUid);

	if (!targetUid) {
		return <p className="text-gray-500 px-4 mb-4">대상 정보를 불러올 수 없습니다.</p>;
	}

	return (
		<div className="px-4 mt-5">
			<h2 className="text-2xl font-semibold mb-4">{trip?.commentsCount} Comments</h2>
			{/* Existing Comments Display */}
			{/* 댓글 입력 */}
			{isAuthenticated && user ? (
				<AddComment
					targetUid={targetUid}
					parentUid={null}
					targetType={targetType}
				/>
			) : (
				<p className="text-gray-500 mb-4">Please Login to write a comment.</p>
			)}
			<AllComments
				targetUid={targetUid}
				targetType={targetType}
				rootComments={rootComments}
				isLoading={isLoading} />
		</div>
	);
}