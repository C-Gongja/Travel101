import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
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
	const { trip } = useTripStore();
	const scrollContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 참조
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [localPreviewUrls, setLocalPreviewUrls] = useState<string[]>([]); // URL.createObjectURL로 생성된 로컬 미리보기 URL
	const [filesToUpload, setFilesToUpload] = useState<File[]>([]); // 백엔드로 업로드할 File 객체
	const [isDragging, setIsDragging] = useState(false);

	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(false);

	const currentTotalMediaCount = media.length + localPreviewUrls.length;

	// 스크롤 위치를 모니터링하여 버튼 가시성을 업데이트하는 함수
	const updateScrollButtonVisibility = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
			setShowRightScroll(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 1); // 1px 여유
			setShowLeftScroll(scrollLeft > 1); // 1px 여유
		}
	}, []);

	// 이미지나 컨테이너 크기 변경 시 스크롤 버튼 가시성 업데이트
	useEffect(() => {
		const handler = setTimeout(updateScrollButtonVisibility, 100); // 이미지 로딩과 렌더링 후 정확한 너비 얻기
		return () => clearTimeout(handler);
	}, [media, localPreviewUrls, updateScrollButtonVisibility]); // media, localPreviewUrls 변경 시 재계산

	// 컨테이너 크기 변경(리사이즈) 감지
	useEffect(() => {
		const handleResize = () => updateScrollButtonVisibility();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [updateScrollButtonVisibility]);

	// `URL.createObjectURL`로 생성된 URL은 사용 후 해제해야 메모리 누수를 방지할 수 있습니다.
	useEffect(() => {
		return () => {
			localPreviewUrls.forEach(url => URL.revokeObjectURL(url));
		};
	}, [localPreviewUrls]);

	const handleAddMediaClick = () => {
		if (currentTotalMediaCount >= MAX_IMAGES) {
			alert(`You can only upload up to ${MAX_IMAGES} images.`);
			return;
		}
		fileInputRef.current?.click();
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		processFiles(files);
		event.target.value = ''; // 동일 파일 재선택 가능하게 input 초기화
	};

	const handleRemoveImage = (type: 'existing' | 'local', indexToRemove: number) => {
		if (type === 'existing') {
			// 이미 S3에 업로드되어 `media` prop으로 전달받은 이미지를 삭제
			const updatedMedia = media.filter((_, index) => index !== indexToRemove);
			setMedia(updatedMedia); // Zustand 스토어 업데이트 요청
			// TODO: 백엔드에 이 s3Key를 가진 미디어를 삭제하라는 API 요청을 보낼 수도 있습니다.
			// 혹은, TripUpdate API에서 최종적으로 삭제된 미디어를 처리하도록 맡길 수도 있습니다.
			// (현재 설계에서는 TripUpdate 시점에 최종적으로 결정되므로, 여기서 별도 삭제 API 호출은 선택 사항)
		} else {
			// 로컬에서만 관리되는 미리보기 이미지를 삭제
			const removedUrl = localPreviewUrls[indexToRemove];
			URL.revokeObjectURL(removedUrl); // 메모리 해제

			setLocalPreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
			setFilesToUpload(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
		}
	};

	const processFiles = (selectedFiles: FileList | null) => {
		if (!selectedFiles) return;

		const newLocalUrls: string[] = [];
		const newFilesToUpload: File[] = [];
		const remainingSlots = MAX_IMAGES - currentTotalMediaCount;

		for (let i = 0; i < Math.min(selectedFiles.length, remainingSlots); i++) {
			const file = selectedFiles[i];
			if (file.type.startsWith('image/') || file.type.startsWith('video/')) { // 비디오도 허용
				newFilesToUpload.push(file);
				newLocalUrls.push(URL.createObjectURL(file));
			} else {
				alert("Only image or video files are allowed.");
				return; // 유효하지 않은 파일 발견 시 처리 중단
			}
		}

		setLocalPreviewUrls(prevUrls => [...prevUrls, ...newLocalUrls]);
		setFilesToUpload(prevFiles => [...prevFiles, ...newFilesToUpload]);
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		const files = event.dataTransfer.files;
		processFiles(files);
	};

	const scrollToImage = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const images = Array.from(container.children) as HTMLElement[]; // 자식 요소들을 HTML 엘리먼트 배열로 캐스팅
			const currentScrollLeft = container.scrollLeft;
			const containerWidth = container.clientWidth;
			const gap = 8; // gap-2는 8px

			let targetScrollLeft = currentScrollLeft;
			if (direction === 'right') {
				for (let i = 0; i < images.length; i++) {
					const image = images[i];
					const imageRight = image.offsetLeft + image.offsetWidth + gap;
					// 현재 보이는 뷰포트의 오른쪽 경계가 이미지의 오른쪽 경계를 지나면
					if (imageRight > currentScrollLeft + containerWidth) {
						// 해당 이미지를 뷰포트 가운데로 오게 스크롤
						targetScrollLeft = image.offsetLeft - (containerWidth / 2) + (image.offsetWidth / 2);
						break;
					}
					// 마지막 이미지이고, 마지막 이미지가 전부 보이지 않으면 끝까지 스크롤
					if (i === images.length - 1 && imageRight > currentScrollLeft + containerWidth) {
						targetScrollLeft = containerWidth;
					}
				}
			} else { // direction === 'left'
				for (let i = images.length - 1; i >= 0; i--) {
					const image = images[i];
					const imageLeft = image.offsetLeft - gap;

					// 현재 보이는 뷰포트의 왼쪽 경계가 이미지의 왼쪽 경계를 지나면 (즉, 이미지가 왼쪽으로 숨겨져 있으면)
					if (imageLeft < currentScrollLeft) {
						// 해당 이미지를 뷰포트 가운데로 오게 스크롤
						targetScrollLeft = image.offsetLeft - (containerWidth / 2) + (image.offsetWidth / 2);
						break;
					}
					// 첫 번째 이미지이고, 첫 번째 이미지가 보이지 않으면 0으로 스크롤
					if (i === 0 && imageLeft < currentScrollLeft) {
						targetScrollLeft = 0;
					}
				}
			}

			container.scrollTo({
				left: Math.max(0, targetScrollLeft), // 0보다 작아지지 않도록
				behavior: 'smooth',
			});
			// 스크롤 후 버튼 가시성 즉시 업데이트
			setTimeout(updateScrollButtonVisibility, 300); // 스크롤 애니메이션 시간 고려
		}
	};

	// !!! 업로드 성공 시 호출될 콜백 함수 !!!
	const handleSaveSuccess = useCallback((uploadedMedia: S3Location[]) => {
		// 이 `uploadedMedia`는 useS3MediaUpload 훅의 onSuccess에서 전달됩니다.
		// Zustand 스토어는 이미 useS3MediaUpload 훅에서 업데이트되었으므로
		// 여기서는 로컬 미리보기 상태만 리셋하면 됩니다.

		// 기존 localPreviewUrls 해제 (메모리 누수 방지)
		localPreviewUrls.forEach(url => URL.revokeObjectURL(url));

		// localPreviewUrls와 filesToUpload 상태 리셋
		setLocalPreviewUrls([]);
		setFilesToUpload([]);

		// (선택 사항) 사용자에게 알림
		alert("미디어가 성공적으로 업로드되었습니다!");

		// `media` prop은 이미 `useS3MediaUpload`의 `onSuccess`에서 `updateLocationMedia`를 통해
		// Zustand 스토어가 업데이트되고, 그 변경이 다시 `LocationMedia` 컴포넌트로 전달되므로
		// 여기서 `setMedia`를 직접 호출할 필요는 없습니다.
		// console.log("Uploaded media received in LocationMedia:", uploadedMedia);
	}, [localPreviewUrls]); // localPreviewUrls가 변경될 때마다 새로운 함수 인스턴스를 생성해야 함

	const handleSaveError = useCallback((error: Error) => {
		console.error("Failed to save media:", error);
		alert(`미디어 업로드 실패: ${error.message}`);
	}, []);

	return (
		<div
			className={`ml-[18px] mr-4 border-2 rounded-xl flex flex-col items-start space-y-2 p-2 relative ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-none'
				}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
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

					{/* 업로드된 이미지 및 로컬 미리보기 - 가로 정렬 및 고정 높이 적용 */}
					<div
						ref={scrollContainerRef}
						className={`flex flex-nowrap items-center gap-2 mt-2 overflow-x-auto ${IMAGE_ROW_HEIGHT} w-full py-1`}
						onScroll={updateScrollButtonVisibility}
					>
						{/* 기존 미디어 (S3에서 로드된 것) */}
						{media.map((file, index) => (
							<div
								key={`existing-${index}`}
								className="relative h-full flex-shrink-0 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden group bg-gray-100"
							>
								<img
									src={file.presignedUrl} // S3 URL (Pre-signed URL)
									alt={`Uploaded ${index + 1}`}
									className="max-w-full h-full object-contain"
								/>
								<button
									onClick={() => handleRemoveImage('existing', index)}
									className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
									aria-label="Remove image"
								>
									<MdDeleteForever size={18} />
								</button>
							</div>
						))}

						{/* 새로 추가된 로컬 미리보기 미디어 (업로드 대기 중) */}
						{localPreviewUrls.map((localUrl, index) => (
							<div
								key={`local-${index}`}
								className="relative h-full flex-shrink-0 border-2 border-red-500 border-dashed rounded-md flex items-center justify-center overflow-hidden group bg-yellow-50"
							>
								{localUrl.startsWith('blob:video') || localUrl.includes('.mp4') ? ( // 비디오인 경우 video 태그
									<video controls className="max-w-full h-full object-contain">
										<source src={localUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : ( // 이미지인 경우 img 태그
									<img
										src={localUrl} // URL.createObjectURL로 생성된 로컬 URL
										alt={`New ${index + 1}`}
										className="max-w-full h-full object-contain"
									/>
								)}
								<button
									onClick={() => handleRemoveImage('local', index)}
									className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
									aria-label="Remove new image"
								>
									<MdDeleteForever size={18} />
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

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageUpload}
				multiple
				accept="image/*,video/*" // 비디오 파일도 허용
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
				{/* 업로드할 파일이 있을 때만 저장 버튼 표시 */}
				{(filesToUpload.length > 0 && trip?.tripUid) && (
					<LocationMediaSaveBtn
						tripUid={trip?.tripUid}
						dayIndex={dayIndex}
						locIndex={locIndex}
						filesToUpload={filesToUpload}
						// isMediaChanged={filesToUpload.length > 0} // 필요하다면 이 prop을 전달
						onSaveSuccess={handleSaveSuccess} // !!! 콜백 전달 !!!
						onSaveError={handleSaveError} // 에러 콜백 전달
					/>
				)}
			</div>
		</div>
	);
};

export default LocationMedia;