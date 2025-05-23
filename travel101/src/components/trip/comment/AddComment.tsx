'use client'

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/user/user-store";
import { CommentRequestProps } from "@/types/trip/comment/tripCommentTypes";
import { useAddComment } from "@/hooks/trip/comment/useAddComment";

interface AddCommentProps {
	targetUid: string;
	targetType: string;
	parentUid: string | null;
	setShowReplyInput?: (show: boolean) => void;
}

export const AddComment = ({ targetUid, parentUid, targetType, setShowReplyInput }: AddCommentProps) => {
	const { user } = useUserStore();
	const { addComment, isSaving, error, isSuccess } = useAddComment();
	const [commentText, setCommentText] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [commentText]);

	useEffect(() => {
		if (isSuccess && !isSaving) {
			setCommentText('');
			if (setShowReplyInput) {
				setShowReplyInput(false);
			}
		}
	}, [isSuccess, isSaving, setShowReplyInput]);

	const handleCommentSubmit = useCallback(() => {
		if (!commentText.trim() || !user) return;
		const newComment: CommentRequestProps = {
			targetUid,
			targetType,
			content: commentText.trim(),
			parentUid: parentUid || null,
		};
		addComment(newComment);
	}, []);

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
					<textarea
						ref={textareaRef}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						onFocus={() => setIsFocused(true)}
						disabled={isSaving}
						placeholder="write comment..."
						rows={1}
						className={clsx(
							'w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-all resize-none overflow-hidden',
							isSaving && 'opacity-50'
						)}
					/>

					{isFocused && (<div className="mt-2 flex justify-end items-center gap-2">
						{error && <p className="text-red-500 text-sm mt-1">Error: {error.message}</p>}
						<button
							onClick={() => {
								setIsFocused(false);
								setShowReplyInput?.(false);
							}}
							className="px-4 py-1 text-sm text-gray-700 hover:text-black"
						>
							Cancel
						</button>
						<button
							onClick={handleCommentSubmit}
							disabled={!commentText.trim()}
							className={clsx(
								'px-4 py-2 text-sm text-white rounded-md',
								commentText.trim() && !isSaving
									? 'bg-blue-500 hover:bg-blue-600'
									: 'bg-gray-400 cursor-not-allowed'
							)}
						>
							{isSaving ? 'Posting...' : parentUid ? 'Post replies' : 'Post comment'}
						</button>
					</div>
					)}
				</div>
			</div>
		</div>
	);
};
