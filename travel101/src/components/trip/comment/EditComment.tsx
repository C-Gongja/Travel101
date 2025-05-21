'use client'

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/user/user-store";
import { CommentEditProps, TripCommentProps, TripCommentRequestProps } from "@/types/trip/comment/tripCommentTypes";
import { useEditComment } from "@/hooks/trip/comment/useEditComment";

interface EditCommentProps {
	originalComment: TripCommentProps;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditComment = ({ originalComment, setIsEdit }: EditCommentProps) => {
	const { user, isAuthenticated } = useUserStore();
	const { editComment, isSaving, error } = useEditComment();
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
		const newComment: CommentEditProps = {
			commentUid: originalComment.uid,
			content: newCommentText.trim(),
		};

		console.log('Submitting edit comment:', newComment);
		// addComment(newComment);
		editComment(newComment);
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
					<textarea
						ref={textareaRef}
						value={newCommentText}
						onChange={(e) => setNewCommentText(e.target.value)}
						disabled={isSaving}
						placeholder="write comment..."
						rows={1}
						className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-all resize-none overflow-hidden"
					/>

					<div className="mt-2 flex justify-end gap-2">
						<button
							onClick={() => {
								setNewCommentText(originalComment?.content);
								setIsEdit(false);
							}}
							className="px-4 py-1 text-sm text-gray-700 hover:text-black"
						>
							Cancel
						</button>
						<button
							onClick={handleCommentSubmit}
							disabled={newCommentText.trim() === originalComment?.content}
							className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
						>
							Post
						</button>
					</div>

					{error && <p className="text-red-500 text-sm mt-1">Error: {error.message}</p>}
				</div>
			</div>
		</div>
	);
};