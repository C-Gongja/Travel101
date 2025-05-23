// components/CommentDropdown.tsx
import { useDeleteComment } from '@/hooks/trip/comment/useDeleteComment';
import { CommentProps } from '@/types/trip/comment/tripCommentTypes';
import { useEffect, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';

interface CommentDropdownProps {
	isOwner: boolean;
	comment: CommentProps;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommentDropdown = ({ isOwner, comment, setIsEdit }: CommentDropdownProps) => {
	const [showMenu, setShowMenu] = useState(false);
	const { deleteComment, isDeleting, error } = useDeleteComment();
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setShowMenu(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleDelete = async () => {
		deleteComment(comment.uid);
		setShowMenu(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button onClick={() => setShowMenu((prev) => !prev)} className="text-xl">
				<BiDotsVerticalRounded />
			</button>

			{showMenu && (
				<div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
					{isOwner ? (
						<>
							<button
								onClick={() => {
									setShowMenu(false);
									setIsEdit(true);
								}}
								className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
							>
								Edit
							</button>
							<button
								onClick={handleDelete}
								className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
							>
								Delete
							</button>
						</>
					) : (
						<button
							onClick={() => {
								setShowMenu(false);
								// onReport();
							}}
							className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-orange-500"
						>
							Report
						</button>
					)}
				</div>
			)}
		</div>
	);
};
