'use client';

import { useRef, useState } from "react";
import { TripCardListProps } from "@/types/trip/tripCardTypes";
import { useRouter } from "next/navigation";
import { FaRegComment } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { BiLike } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // 화살표 아이콘 임포트
import Image from 'next/image'; // next/image 컴포넌트 임포트

const TripCard = ({ trip }: TripCardListProps) => {
	const start = new Date(trip.startDate);
	const end = new Date(trip.endDate);
	const daysDifference = !isNaN(start.getTime()) && !isNaN(end.getTime())
		? Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
		: "Invalid dates";

	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handleClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		// 슬라이더 버튼 또는 인디케이터 점을 클릭한 경우 페이지 이동을 막음
		if (target.closest('.scroll-button') || target.closest('.indicator-dot')) {
			e.stopPropagation();
			return;
		}
		console.log("tripUid: ", trip.tripUid);
		router.push(`/trip/${trip.tripUid}`);
	};

	const mediaToDisplay = trip.media ? trip.media.slice(0, 5) : [];
	const hasMedia = mediaToDisplay.length > 0;

	const scrollToImage = (index: number) => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const scrollPosition = index * container.clientWidth;
			container.scrollTo({
				left: scrollPosition,
				behavior: 'smooth',
			});
			setCurrentImageIndex(index);
		}
	};

	const goToNextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!hasMedia) return;
		const nextIndex = (currentImageIndex + 1) % mediaToDisplay.length;
		scrollToImage(nextIndex);
	};

	const goToPrevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!hasMedia) return;
		const prevIndex = (currentImageIndex - 1 + mediaToDisplay.length) % mediaToDisplay.length;
		scrollToImage(prevIndex);
	};

	const handleScroll = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const scrollLeft = container.scrollLeft;
			const clientWidth = container.clientWidth;
			const newIndex = Math.round(scrollLeft / clientWidth);
			if (newIndex !== currentImageIndex) {
				setCurrentImageIndex(newIndex);
			}
		}
	};

	return (
		<li
			onClick={handleClick}
			className="border border-gray-300 rounded-lg overflow-hidden  min-w-[250px]
			transition-all duration-300 ease-in-out bg-white cursor-pointer 
			hover:border-maincolor/50 hover:shadow-glow-main"
		>
			{/* 1. 이미지 슬라이더 섹션 */}
			{/* `group` 클래스를 추가하여 하위 요소들이 이 컨테이너의 hover 상태를 감지할 수 있도록 함 */}
			<div className="w-full h-[250px] relative overflow-hidden group transition-all duration-300">
				{hasMedia ? (
					<>
						<div
							ref={scrollContainerRef}
							className="flex w-full h-full overflow-x-hidden overflow-y-hidden scroll-smooth snap-x snap-mandatory"
							onScroll={handleScroll}
						>
							{mediaToDisplay.map((file, index) => (
								<div
									key={`${trip.tripUid}-${file.s3Key || index}`}
									className="relative flex-shrink-0 w-full h-full snap-center hover:scale-105 transition-all duration-300"
								>
									{file.s3Key.toLowerCase().endsWith('.mp4') || file.s3Key.toLowerCase().endsWith('.mov') ? (
										<video
											src={file.presignedUrl}
											controls={false}
											autoPlay
											loop
											muted
											playsInline
											className="object-cover w-full h-full pointer-events-none"
										>
											Your browser does not support the video tag.
										</video>
									) : (
										<Image
											src={file.presignedUrl}
											alt={`Trip image ${index + 1}`}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											className="object-cover pointer-events-none"
											priority={index === 0}
										/>
									)}
								</div>
							))}
						</div>

						{/* 좌우 스크롤 버튼 - 초기 투명(opacity-0) 후 hover 시 나타남(group-hover:opacity-100) */}
						{mediaToDisplay.length > 1 && (
							<>
								<button
									onClick={goToPrevImage}
									className="scroll-button absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-30 text-white rounded-full shadow-md
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out focus:outline-none"
									aria-label="Previous image"
								>
									<IoIosArrowBack size={24} />
								</button>
								<button
									onClick={goToNextImage}
									className="scroll-button absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-30 text-white rounded-full shadow-md
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out focus:outline-none"
									aria-label="Next image"
								>
									<IoIosArrowForward size={24} />
								</button>
							</>
						)}

						{/* 인디케이터 (페이지네이션 점) - 초기 투명 후 hover 시 나타남 */}
						{mediaToDisplay.length > 1 && (
							<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
								{mediaToDisplay.map((_, index) => (
									<button
										key={index}
										onClick={(e) => {
											e.stopPropagation(); // 버블링 방지
											scrollToImage(index);
										}}
										className={`indicator-dot h-1 w-1 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'} transition-colors duration-200 focus:outline-none`}
										aria-label={`Go to image ${index + 1}`}
									/>
								))}
							</div>
						)}
					</>
				) : (
					// 이미지가 없을 경우 대체 UI
					<div className="bg-maincolor/20 h-full w-full flex items-center justify-center text-gray-500 hover:scale-105">
						<img
							className="w-16 h-16 text-gray-400"
							src='/img/logo-color.png'
						>
						</img>
					</div>
				)}
			</div>

			{/* 2. 제목, 정보, 통계 섹션 */}
			<div className="p-4">
				<div className="flex-row items-start">
					<div className="flex">
						<h3 className="text-xl font-semibold text-gray-900 leading-tight pr-2">{trip.name}</h3>
						<div className="flex gap-2">
							{trip?.countries && trip.countries.length > 0 ? (
								trip.countries.map((country) => (
									<span key={country.iso2} className="text-2xl" role="img"
									// aria-label={country.name}
									>
										{country.flag}
									</span>
								))
							) : (
								<p className="text-gray-500 text-sm"></p>
							)}
						</div>
					</div>
					<div className="flex flex-row items-center gap-3 flex-shrink-0">
						<div className="flex items-center gap-1 text-gray-600">
							<BiLike className="text-lg" />
							<p className="text-sm">{trip.likesCount !== undefined ? trip.likesCount : 0}</p>
						</div>
						<div className="flex items-center gap-1 text-gray-600">
							<FaRegComment className="text-lg" />
							<p className="text-sm">{trip.commentsCount !== undefined ? trip.commentsCount : 0}</p>
						</div>
						<div className="flex items-center gap-1 text-gray-600">
							<FiShare2 className="text-lg" />
							<p className="text-sm">{trip.scriptedCount !== undefined ? trip.scriptedCount : 0}</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col mt-2">
					<p className="text-gray-600 mt-1 text-base font-medium">{trip.username}</p>
					<p className="text-gray-500 mt-1 text-sm">{daysDifference} days trip</p>
				</div>
			</div>
		</li>
	);
};

export default TripCard;