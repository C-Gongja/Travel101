import { useTripStore } from '@/store/trip/trip-store';
import React, { useRef, useEffect } from 'react';

interface LocationDescriptionProps {
	description: string;
	isOwner: boolean;
	dayIndex: number;
	locIndex: number;
	setDescription: ReturnType<typeof useTripStore>['setDescription'];
}

const LocationDescription: React.FC<LocationDescriptionProps> = ({
	description,
	isOwner,
	dayIndex,
	locIndex,
	setDescription,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		setDescription(dayIndex, locIndex, value);
	};

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto'; // 높이를 먼저 초기화
			textarea.style.height = `${textarea.scrollHeight}px`; // 내용 높이에 맞춰 설정
		}
	}, [description]); // description이 변경될 때마다 실행

	return (
		isOwner ? (
			<textarea
				ref={textareaRef}
				onChange={handleDescriptionChange}
				name="description"
				placeholder="write some details..."
				value={description}
				className="text-gray-500 text-sm block w-full max-w-xs mt-2 px-2 py-1 rounded resize-none
                    focus:outline-none focus:border focus:border-blue-500"
				wrap="soft"
				rows={1}
			/>
		) : (
			<p className="text-gray-500 text-sm w-full max-w-xs mt-2 px-2 py-1 whitespace-pre-wrap">
				{description || ""}
			</p>
		)
	);
};

export default LocationDescription;