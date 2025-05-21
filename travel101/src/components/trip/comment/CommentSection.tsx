import { useUserStore } from "@/store/user/user-store";
import { useState } from "react";
import { AddComment } from "./AddComment";
import { AllComments } from "./AllCommnets";
import { useTripStore } from "@/store/trip/trip-store";
import { useGetTripRootComments } from "@/hooks/trip/comment/useGetTripRootComments";

type CommentSectionProps = {
	targetType: string;
};

export const CommentSection = ({ targetType }: CommentSectionProps) => {
	const { user, isAuthenticated } = useUserStore();
	const { trip } = useTripStore();
	const tripUid = trip?.tripUid;

	if (!tripUid) return null; // 또는 로딩 처리, 에러 메시지 등

	const { data: rootComments, isLoading } = useGetTripRootComments(targetType, tripUid);

	return (
		<div className="px-4">
			<h2 className="text-xl font-semibold mb-4">Comments</h2>
			{/* Existing Comments Display */}
			{/* 댓글 입력 */}
			{isAuthenticated && user ? (
				<AddComment tripUid={tripUid} parentUid={rootComments?.parentUid} targetType={targetType} />
			) : (
				<p className="text-gray-500 mb-4">댓글을 작성하려면 로그인하세요.</p>
			)}
			<AllComments tripUid={tripUid} targetType={targetType} rootComments={rootComments} isLoading={isLoading} />
		</div>
	);
}