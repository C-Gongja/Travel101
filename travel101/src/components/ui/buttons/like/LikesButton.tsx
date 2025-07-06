'use client'

import { useState } from "react";
import clsx from "clsx";
import { BiSolidLike, BiLike } from "react-icons/bi";

import { useLikes } from "@/hooks/likes/useLikes";
import { useAuthAction } from "@/hooks/auth/useAuthGuard";

interface LikesButtonProps {
	targetType: string;
	targetUid: string;
	isLiked: boolean | undefined;
	setIsLiked: (isLiked: boolean) => void;
};

const LikesButton = ({ targetType, targetUid, isLiked, setIsLiked }: LikesButtonProps) => {
	const { executeWithAuth } = useAuthAction();
	const { mutateLikes, isSaving, error } = useLikes({
		isLiked,
		onToggleLike: setIsLiked,
	});

	const handleLikesClick = executeWithAuth(() => {
		mutateLikes({ targetType, targetUid });
	});

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={handleLikesClick}
				disabled={isSaving}
				className={clsx(
					'transition duration-200',
					isLiked ? 'text-maincolor' : 'text-gray-500',
					'hover:text-maincolor focus:outline-none',
					isSaving && 'opacity-50 cursor-not-allowed'
				)}
				aria-label={isLiked ? 'Unlike' : 'Like'}
			>
				{isLiked ? <BiSolidLike /> : <BiLike />}
			</button>
			{error && <p className="text-red-500 text-sm">{error.message}</p>}
		</div>
	);
};
export default LikesButton;