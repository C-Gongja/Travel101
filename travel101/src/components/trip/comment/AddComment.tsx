'use client'

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/user/user-store";
import { TripCommentRequestProps } from "@/types/trip/comment/tripCommentTypes";
import { useAddTripComment } from "@/hooks/trip/comment/useAddTripComment";

interface AddCommentProps {
	tripUid: string;
	parentUid: string | null;
	targetType: string;
	setShowReplyInput?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddComment = ({ tripUid, parentUid, targetType, setShowReplyInput }: AddCommentProps) => {
	const { user, isAuthenticated } = useUserStore();
	const { addComment, isSaving, error } = useAddTripComment();
	const [commentText, setCommentText] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [commentText]);

	const handleCommentSubmit = () => {
		if (!commentText.trim() || !user) return;
		const newComment: TripCommentRequestProps = {
			tripUid,
			userUid: user?.uid,
			targetType: targetType,
			content: commentText.trim(),
			parentUid,
		};

		console.log('Submitting comment:', newComment);
		addComment(newComment);
		setCommentText('');
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
					<textarea
						ref={textareaRef}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						onFocus={() => setIsFocused(true)}
						disabled={isSaving}
						placeholder="write comment..."
						rows={1}
						className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-all resize-none overflow-hidden"
					/>

					{isFocused && (<div className="mt-2 flex justify-end gap-2">
						<button
							onClick={() => {
								setIsFocused(false);
								setShowReplyInput?.(false);
								setCommentText('');
							}}
							className="px-4 py-1 text-sm text-gray-700 hover:text-black"
						>
							Cancel
						</button>
						<button
							onClick={handleCommentSubmit}
							disabled={!commentText.trim()}
							className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
						>
							Post
						</button>
					</div>
					)}
					{error && <p className="text-red-500 text-sm mt-1">Error: {error.message}</p>}
				</div>
			</div>
		</div>
	);
};