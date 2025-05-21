// CommentItem.tsx
import { useState } from 'react';
import { AddComment } from './AddComment';
import { TripCommentProps } from '@/types/trip/comment/tripCommentTypes';
import { useGetCommentReplies } from '@/hooks/trip/comment/useGetCommentReplies';
import { BiCommentDetail, BiLike, BiDotsVerticalRounded } from "react-icons/bi";
import { CommentDropdown } from './CommentDropdown';
import { useUserStore } from '@/store/user/user-store';
import { EditComment } from './EditComment';

interface CommentItemProps {
	tripUid: string;
	comment: TripCommentProps;
	targetType: string;
}

export const CommentItem = ({ tripUid, comment, targetType }: CommentItemProps) => {
	const { user } = useUserStore();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const {
		data: replyData,
		isLoading: loadingReplies,
		isSuccess: repliesLoaded,
	} = useGetCommentReplies(comment.uid, {
		enabled: showReplies,
	});

	const replies = replyData || [];
	// 유저가 댓글을 달고 싶은 위치의 comment uid를 parent로 보내야함
	return (
		<div className="">
			{/* 댓글 본문 */}
			{!isEdit ? (
				<>
					<div className="flex gap-3 items-start">
						<img
							src="/img/logo-color.png"
							alt="User profile"
							className="w-10 h-10 rounded-full object-cover"
						/>
						<div className="flex-1">
							<p className="">{comment.username}</p>
							<p className="whitespace-pre-line">{comment.content}</p>
						</div>
						<CommentDropdown
							isOwner={user?.uid === comment.userUid}
							comment={comment}
							setIsEdit={setIsEdit}
						/>
					</div>
					<div>
						<div className='ml-12 pt-2 text-lg space-x-5'>
							<button>
								<BiLike />
							</button>
							<button onClick={() => setShowReplyInput(prev => !prev)}>
								<BiCommentDetail />
							</button>
						</div>
						{/* 하트 */}
						{/* 대댓글 작성 */}
						<div className='ml-12'>
							{showReplyInput && (
								<AddComment
									tripUid={tripUid}
									parentUid={comment.uid}
									targetType={targetType}
									setShowReplyInput={setShowReplyInput}
								/>
							)}
						</div>
					</div>
				</>
			) :
				(<EditComment originalComment={comment} setIsEdit={setIsEdit} />)}

			{/* View Replies */}
			{comment.childCount > 0 && (
				<button
					className="ml-14 text-sm text-blue-500 hover:underline"
					onClick={() => setShowReplies(prev => !prev)}
				>
					{comment.childCount} replies
				</button>
			)}

			{/* Replies */}
			{showReplies && (
				<div className="ml-14 mt-2 space-y-3">
					{/* 대댓글 목록 */}
					{loadingReplies ? (
						<p className="text-sm text-gray-400">loading...</p>
					) : (
						replies.map((reply: TripCommentProps) => (
							<CommentItem key={reply.uid} tripUid={tripUid} comment={reply} targetType={targetType} />
						))
					)}
				</div>
			)}
		</div>
	);
};
