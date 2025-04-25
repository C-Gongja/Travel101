'use client';

import { TripCardListProps } from "@/types/trip/tripCardTypes";
import { useRouter } from "next/navigation";
import { FiShare2 } from "react-icons/fi";

const TripCard = ({ trip }: TripCardListProps) => {
	const start = new Date(trip.startDate);
	const end = new Date(trip.endDate);
	const daysDifference = !isNaN(start.getTime()) && !isNaN(end.getTime())
		? Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
		: "Invalid dates";

	const router = useRouter();

	const handleClick = (e: any) => {
		e.preventDefault()
		router.push(`/trip/${trip.id}`);
	};


	return (
		<li
			onClick={handleClick}
			className="border rounded-lg shadow-md overflow-hidden transition duration-150 bg-white cursor-pointer hover:scale-105"
		>
			{/* 1. 이미지 (Placeholder) */}
			<div className="bg-green-100 h-[250px] flex items-center justify-center">
				<svg
					className="w-12 h-12 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 16l4-4 4 4 4-4 4 4m-12-8h8m-4 4v8"
					/>
				</svg>
			</div>
			{/* 2. 제목과 설명 */}
			<div className="p-4">
				<div className="flex justify-between">
					<div className="flex flex-row items-center gap-3">
						<h3 className="text-lg font-semibold">{trip.name}</h3>
						<div className="flex flex-row items-center gap-1">
							<FiShare2 />
							<p className="text-gray-600">{trip.scripted}</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col">
					<p className="text-gray-600 mt-1">countries (flags)</p>
					<p className="text-gray-600 mt-1">{trip.username}</p>
					<p className="text-gray-600 mt-1">{daysDifference} days trip</p>
				</div>
			</div>
		</li>
	);
};

export default TripCard;