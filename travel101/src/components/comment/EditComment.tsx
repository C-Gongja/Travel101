'use client'

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/user/user-store";
import { CommentUpdateProps, CommentProps, CommentRequestProps } from "@/types/comment/tripCommentTypes";
import { useEditComment } from "@/hooks/comment/useEditComment";

interface EditCommentProps {
	originalComment: CommentProps;
	targetType: string;
	targetUid: string;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditComment = ({ originalComment, targetType, targetUid, setIsEdit }: EditCommentProps) => {
	const { user, isAuthenticated } = useUserStore();
	const { updateComment, isSaving, error } = useEditComment();
	const [newCommentText, setNewCommentText] = useState(originalComment?.content);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [newCommentText]);

	const handleCommentSubmit = () => {
		if (!newCommentText.trim() || !user) return;
		const newComment: CommentUpdateProps = {
			uid: originalComment.uid,
			targetType: targetType,
			targetUid: targetUid,
			content: newCommentText.trim(),
			parentUid: originalComment.parentUid || null,
		};

		console.log('Submitting edit comment:', newComment);
		updateComment(newComment);
		setIsEdit(false);
	};

	return (
		<div className="mb-2">
			<div className="flex gap-3">
				{/* Profile Image */}
				<div className="w-10 h-10 flex-shrink-0">
					<img
						src="/img/logo-color.png"
						alt="thumbnail"
						className="object-cover rounded-full w-full h-full"
						onError={(e) => (e.currentTarget.src = '')}
						loading="lazy"
					/>
				</div>

				{/* Input Area */}
				<div className="flex-1">

					<div className="flex-1">
						<div className='flex flex-row gap-2 items-center'>
							<p>@{originalComment.username || '익명 사용자'}</p>
							<p className="text-xs text-gray-500 mt-1">
								{new Date(originalComment.createdAt).toLocaleString('en-KR')}
							</p>
						</div>
						<textarea
							ref={textareaRef}
							value={newCommentText}
							onChange={(e) => setNewCommentText(e.target.value)}
							disabled={isSaving}
							placeholder="write comment..."
							rows={1}
							className={clsx(
								'w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-all resize-none overflow-hidden',
								isSaving && 'opacity-50'
							)}
						/>
					</div>

					<div className="mt-2 flex justify-end gap-2">
						<button
							onClick={() => {
								setNewCommentText(originalComment?.content);
								setIsEdit(false);
							}}
							className="px-4 py-1 text-sm text-gray-700 hover:text-black"
							disabled={isSaving}
						>
							Cancel
						</button>
						<button
							onClick={handleCommentSubmit}
							disabled={newCommentText.trim() === originalComment?.content || isSaving}
							className={clsx(
								'px-4 py-1 text-sm text-white rounded-md',
								newCommentText.trim() && !isSaving
									? 'bg-blue-500 hover:bg-blue-600'
									: 'bg-gray-400 cursor-not-allowed'
							)}
						>
							{isSaving ? 'Posting...' : 'Edit'}
						</button>
					</div>

					{error && <p className="text-red-500 text-sm mt-1">Error: {error.message}</p>}
				</div>
			</div>
		</div>
	);
};