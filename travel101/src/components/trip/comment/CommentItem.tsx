// CommentItem.tsx
import { useEffect, useState } from 'react';
import { AddComment } from './AddComment';
import { CommentProps } from '@/types/trip/comment/tripCommentTypes';
import { useGetCommentReplies } from '@/hooks/trip/comment/useGetCommentReplies';
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { CommentDropdown } from './CommentDropdown';
import { useUserStore } from '@/store/user/user-store';
import { EditComment } from './EditComment';
import { CommentSectionProps } from './CommentSection';

export interface CommentItemProps extends CommentSectionProps {
	comment: CommentProps;
}

export const CommentItem = ({ targetUid, comment, targetType }: CommentItemProps) => {
	const { user } = useUserStore();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const {
		data: replyData,
		isLoading: loadingReplies,
		isSuccess: repliesLoaded,
	} = useGetCommentReplies(comment.uid, { enabled: showReplies, });

	useEffect(() => {
		if (comment.childCount > 0 && showReplyInput) {
			setShowReplies(true);
		}
	}, [comment.childCount, showReplyInput]);

	const replies = replyData || [];

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
							<div className='flex flex-row gap-2 items-center'>
								<p>@{comment.username || '익명 사용자'}</p>
								<p className="text-xs text-gray-500 mt-1">
									{new Date(comment.createdAt).toLocaleString('en-KR')}
								</p>
							</div>
							<p className="whitespace-pre-line">{comment.content}</p>
						</div>
						<CommentDropdown
							isOwner={user?.username === comment.username}
							comment={comment}
							setIsEdit={setIsEdit}
						/>
					</div>
					<div className="ml-12 pt-2 flex gap-5">
						<button className="text-lg">
							<BiLike />
						</button>
						<button
							onClick={() => setShowReplyInput((prev) => !prev)}
							className="text-lg"
						>
							<BiCommentDetail />
						</button>
					</div>
					{showReplyInput && (
						<div className="ml-12 mt-2">
							<AddComment
								parentUid={comment.uid}
								targetType={targetType}
								targetUid={targetUid}
								setShowReplyInput={setShowReplyInput}
							/>
						</div>
					)}
				</>
			) : (
				<EditComment
					originalComment={comment}
					targetType={targetType}
					targetUid={targetUid}
					setIsEdit={setIsEdit}
				/>
			)}

			{/* View Replies */}
			{comment.childCount > 0 && (
				<button
					className="ml-14 text-sm text-blue-500 hover:underline"
					onClick={() => setShowReplies(prev => !prev)}
				>
					{showReplies ? 'Hide' : 'Show'} {comment.childCount} {comment.childCount === 1 ? 'reply' : 'replies'}
				</button>
			)}

			{/* Replies */}
			{showReplies && (
				<div className="ml-14 mt-2 space-y-3">
					{/* 대댓글 목록 */}
					{loadingReplies ? (
						<p className="text-sm text-gray-400">loading...</p>
					) : (
						replies.map((reply: CommentProps) => (
							<CommentItem
								key={reply.uid}
								targetUid={targetUid}
								comment={reply}
								targetType={targetType}
							/>
						))
					)}
				</div>
			)}
		</div>
	);
};
