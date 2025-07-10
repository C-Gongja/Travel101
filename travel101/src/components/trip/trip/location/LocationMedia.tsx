import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { MdDeleteOutline } from "react-icons/md";
import { FaFileUpload } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // 스크롤 버튼 아이콘
import { useTripStore } from '@/store/trip/trip-store';
import LocationMediaSaveBtn from './LocationMediaSaveBtn';
import { S3Location } from '@/types/S3/trip/S3TripTypes';

interface LocationMediaProps {
	media: S3Location[];
	setMedia: (newMedia: S3Location[]) => void;
	dayIndex: number;
	locIndex: number;
}

const MAX_IMAGES = 3;
const IMAGE_ROW_HEIGHT = 'h-40';

const LocationMedia: React.FC<LocationMediaProps> = ({ media, setMedia, dayIndex, locIndex }) => {
	const { isOwner, trip } = useTripStore(); // isOwner 상태 가져오기
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [localPreviewUrls, setLocalPreviewUrls] = useState<string[]>([]);
	const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
	// isDragging은 isOwner일 때만 의미 있으므로 조건부로 스타일을 적용합니다.
	const [isDragging, setIsDragging] = useState(false);

	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(false);

	const currentTotalMediaCount = media.length + localPreviewUrls.length;

	const updateScrollButtonVisibility = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
			setShowRightScroll(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 1);
			setShowLeftScroll(scrollLeft > 1);
		}
	}, []);

	useEffect(() => {
		const handler = setTimeout(updateScrollButtonVisibility, 100);
		return () => clearTimeout(handler);
	}, [media, localPreviewUrls, updateScrollButtonVisibility]);

	useEffect(() => {
		const handleResize = () => updateScrollButtonVisibility();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [updateScrollButtonVisibility]);

	useEffect(() => {
		return () => {
			localPreviewUrls.forEach(url => URL.revokeObjectURL(url));
		};
	}, [localPreviewUrls]);

	// isOwner가 아닐 경우, 미디어 추가/업로드 관련 함수들은 작동하지 않도록 방어 로직 추가
	const handleAddMediaClick = () => {
		if (!isOwner) return; // 소유자가 아니면 아무것도 하지 않음
		if (currentTotalMediaCount >= MAX_IMAGES) {
			alert(`You can only upload up to ${MAX_IMAGES} images.`);
			return;
		}
		fileInputRef.current?.click();
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!isOwner) return; // 소유자가 아니면 아무것도 하지 않음
		const files = event.target.files;
		processFiles(files);
		event.target.value = '';
	};

	const handleRemoveImage = (type: 'existing' | 'local', indexToRemove: number) => {
		if (!isOwner) return; // 소유자가 아니면 아무것도 하지 않음

		if (type === 'existing') {
			const updatedMedia = media.filter((_, index) => index !== indexToRemove);
			setMedia(updatedMedia);
		} else {
			const removedUrl = localPreviewUrls[indexToRemove];
			URL.revokeObjectURL(removedUrl);

			setLocalPreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
			setFilesToUpload(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
		}
	};

	const processFiles = (selectedFiles: FileList | null) => {
		if (!isOwner || !selectedFiles) return; // 소유자가 아니거나 파일이 없으면 처리 중단

		const newLocalUrls: string[] = [];
		const newFilesToUpload: File[] = [];
		const remainingSlots = MAX_IMAGES - currentTotalMediaCount;

		for (let i = 0; i < Math.min(selectedFiles.length, remainingSlots); i++) {
			const file = selectedFiles[i];
			if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
				newFilesToUpload.push(file);
				newLocalUrls.push(URL.createObjectURL(file));
			} else {
				alert("Only image or video files are allowed.");
				continue;
			}
		}

		setLocalPreviewUrls(prevUrls => [...prevUrls, ...newLocalUrls]);
		setFilesToUpload(prevFiles => [...prevFiles, ...newFilesToUpload]);
	};

	// 드래그 앤 드롭 이벤트 핸들러도 isOwner일 때만 활성화
	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		if (!isOwner) return;
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		if (!isOwner) return;
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		if (!isOwner) return;
		event.preventDefault();
		setIsDragging(false);
		const files = event.dataTransfer.files;
		processFiles(files);
	};

	const scrollToImage = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const images = Array.from(container.children) as HTMLElement[];
			const currentScrollLeft = container.scrollLeft;
			const containerWidth = container.clientWidth;
			const gap = 8;

			let targetScrollLeft = currentScrollLeft;
			if (direction === 'right') {
				for (let i = 0; i < images.length; i++) {
					const image = images[i];
					const imageRight = image.offsetLeft + image.offsetWidth + gap;
					if (imageRight > currentScrollLeft + containerWidth) {
						targetScrollLeft = image.offsetLeft - (containerWidth / 2) + (image.offsetWidth / 2);
						break;
					}
					if (i === images.length - 1 && imageRight > currentScrollLeft + containerWidth) {
						targetScrollLeft = containerWidth;
					}
				}
			} else {
				for (let i = images.length - 1; i >= 0; i--) {
					const image = images[i];
					const imageLeft = image.offsetLeft - gap;
					if (imageLeft < currentScrollLeft) {
						targetScrollLeft = image.offsetLeft - (containerWidth / 2) + (image.offsetWidth / 2);
						break;
					}
					if (i === 0 && imageLeft < currentScrollLeft) {
						targetScrollLeft = 0;
					}
				}
			}

			container.scrollTo({
				left: Math.max(0, targetScrollLeft),
				behavior: 'smooth',
			});
			setTimeout(updateScrollButtonVisibility, 300);
		}
	};

	const handleSaveSuccess = useCallback((uploadedMedia: S3Location[]) => {
		localPreviewUrls.forEach(url => URL.revokeObjectURL(url));
		setLocalPreviewUrls([]);
		setFilesToUpload([]);
		alert("미디어가 성공적으로 업로드되었습니다!");
	}, [localPreviewUrls]);

	const handleSaveError = useCallback((error: Error) => {
		console.error("Failed to save media:", error);
		alert(`미디어 업로드 실패: ${error.message}`);
	}, []);

	return (
		<div
			className={`ml-[18px] mr-4 border-2 rounded-xl flex flex-col items-start space-y-2 p-2 relative ${isOwner && isDragging ? 'border-blue-500 bg-blue-50' : 'border-none' // isOwner일 때만 드래그 스타일 적용
				}`}
			// isOwner일 때만 드래그 앤 드롭 이벤트 활성화
			onDragOver={isOwner ? handleDragOver : undefined}
			onDragLeave={isOwner ? handleDragLeave : undefined}
			onDrop={isOwner ? handleDrop : undefined}
		>
			{currentTotalMediaCount === 0 ? (
				<>
				</>
			) : (
				<div className="relative w-full flex items-center">
					{/* 왼쪽 스크롤 버튼 */}
					{showLeftScroll && (
						<button
							onClick={() => scrollToImage('left')}
							className="absolute left-0 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none -translate-x-1/2"
						>
							<IoIosArrowBack size={24} className="text-gray-600" />
						</button>
					)}

					{/* 업로드된 이미지 및 로컬 미리보기 */}
					<div
						ref={scrollContainerRef}
						className={`flex flex-nowrap items-center gap-2 mt-2 overflow-x-auto ${IMAGE_ROW_HEIGHT} w-full py-1`}
						onScroll={updateScrollButtonVisibility}
					>
						{/* 기존 미디어 (S3에서 로드된 것) */}
						{media.map((file, index) => (
							<div
								key={`existing-${file.s3Key || index}`}
								className="relative h-full flex-shrink-0 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden group bg-gray-100"
							>
								{file.s3Key.toLowerCase().endsWith('.mp4') || file.s3Key.toLowerCase().includes('.mov') ? (
									<video controls className="max-w-full h-full object-contain">
										<source src={file.presignedUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : (
									<img
										src={file.presignedUrl}
										alt={`Uploaded ${index + 1}`}
										className="max-w-full h-full object-contain pointer-events-none"
									/>
								)}
								{/* isOwner일 때만 삭제 버튼 표시 */}
								{isOwner && (
									<button
										onClick={() => handleRemoveImage('existing', index)}
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
										aria-label="Remove image"
									>
										<MdDeleteOutline size={18} />
									</button>
								)}
							</div>
						))}

						{/* 새로 추가된 로컬 미리보기 미디어 (업로드 대기 중) - isOwner일 때만 표시 */}
						{isOwner && localPreviewUrls.map((localUrl, index) => (
							<div
								key={`local-${index}`}
								className="relative h-full flex-shrink-0 border-2 border-red-500 border-dashed rounded-md flex items-center justify-center overflow-hidden group bg-yellow-50"
							>
								{localUrl.startsWith('blob:video') || localUrl.includes('.mp4') ? (
									<video controls className="max-w-full h-full object-contain">
										<source src={localUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : (
									<img
										src={localUrl}
										alt={`New ${index + 1}`}
										className="max-w-full h-full object-contain"
									/>
								)}
								<button
									onClick={() => handleRemoveImage('local', index)}
									className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
									aria-label="Remove new image"
								>
									<MdDeleteOutline size={18} />
								</button>
							</div>
						))}
					</div>

					{/* 오른쪽 스크롤 버튼 */}
					{showRightScroll && (
						<button
							onClick={() => scrollToImage('right')}
							className="absolute right-0 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none translate-x-1/2"
						>
							<IoIosArrowForward size={24} className="text-gray-600" />
						</button>
					)}
				</div>
			)}

			{/* isOwner일 때만 파일 입력 필드 및 추가/저장 버튼 섹션 표시 */}
			{isOwner && (
				<>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleImageUpload}
						multiple
						accept="image/*,video/*"
						className="hidden"
					/>

					<div className='flex items-center w-full'>
						<button
							onClick={handleAddMediaClick}
							className={`flex items-center justify-center py-1 px-3 gap-1 rounded-full transition duration-200
                          ${currentTotalMediaCount >= MAX_IMAGES
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'text-maincolor hover:bg-maincolor hover:text-white'
								}`}
							disabled={currentTotalMediaCount >= MAX_IMAGES}
						>
							<IoIosAddCircle className="text-xl" /> Add Photo/Video
						</button>
						<span className="ml-2 text-gray-500 mr-6">
							{currentTotalMediaCount}/{MAX_IMAGES}
						</span>
						{/* 업로드할 파일이 있고, tripUid가 있을 때만 저장 버튼 표시 (isOwner 조건 포함) */}
						{(filesToUpload.length > 0 && trip?.tripUid) && (
							<LocationMediaSaveBtn
								tripUid={trip.tripUid}
								dayIndex={dayIndex}
								locIndex={locIndex}
								filesToUpload={filesToUpload}
								onSaveSuccess={handleSaveSuccess}
								onSaveError={handleSaveError}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default LocationMedia;