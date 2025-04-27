import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
	width?: string;
	height?: string;
	margin?: string;
}

const SearchBar: React.FC<Props> = ({ width = '100%', height = 'auto', margin = '0' }) => {
	const heightValue = height === 'auto' ? 0 : parseFloat(height.replace(/[^0-9.]/g, '')) || 0;
	const showPlaceholder = heightValue > 60;
	const router = useRouter();
	const [searchInput, setSearchInput] = useState("");
	const [isDaysActive, setIsDaysActive] = useState(false);
	const [isLocationActive, setIsLocationActive] = useState(false);
	const searchBarRef = useRef<HTMLDivElement>(null);

	// Handle clicks outside the SearchBar to reset active states
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
				setIsDaysActive(false);
				setIsLocationActive(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Enter 키로 검색 실행
	const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			if (searchInput.trim()) {
				router.push(`/search?keyword=${encodeURIComponent(searchInput)}`);
			}
		}
	};

	return (
		<div
			ref={searchBarRef}
			className="my-5 flex items-center bg-white rounded-full shadow-[0px_0px_23px_-4px_rgba(0,_0,_0,_0.1)] p-2 w-full"
			style={{ width, height, margin }}
		>
			<div className="w-2/3 px-4 py-2 border-r border-gray-200">
				<label
					className={`block font-medium px-3 transition duration-150 ${showPlaceholder
						? isLocationActive
							? 'text-xs text-purple-600'
							: 'text-sm text-gray-900'
						: 'hidden'
						}`}
				>
					Where
				</label>
				<input
					type="text"
					onClick={() => {
						setIsLocationActive(true);
						setIsDaysActive(false);
					}}
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleSearch}
					value={searchInput}
					placeholder={showPlaceholder ? "Search Locations" : "Where"}
					className="w-full text-[17px] text-gray-500 focus:outline-none px-3"
				/>
			</div>
			<div className="w-1/3 px-4 py-2 border-gray-200">
				<label
					className={`block font-medium px-3 transition duration-150 ${showPlaceholder
						? isDaysActive
							? 'text-xs text-purple-600'
							: 'text-sm text-gray-900'
						: 'hidden'
						}`}
				>
					Days
				</label>
				<input
					type="text"
					onClick={() => {
						setIsDaysActive(true);
						setIsLocationActive(false);
					}}
					placeholder={showPlaceholder ? "Add Days" : "Days"}
					className="w-full text-[17px] text-gray-500 focus:outline-none px-3"
				/>
			</div>
			<button className="ml-2 p-3 bg-maincolor rounded-full text-white transition duration-150 hover:bg-maindarkcolor">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					className="w-5 h-5"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
		</div>
	);
};

export default SearchBar;