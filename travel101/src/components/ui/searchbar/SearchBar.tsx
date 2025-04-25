import React, { useState } from 'react';
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

	// Enter 키로 검색 실행
	const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			if (searchInput.trim()) {
				router.push(`/search?keyword=${encodeURIComponent(searchInput)}`);
			}
		}
	};

	{/* <input
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleSearch}
					type="text"
					placeholder="Search..."
					value={searchInput}
					className="w-full border rounded-full py-2 px-4 pl-10 shadow-md focus:outline-none focus:ring-1 focus:ring-maincolor"
				/>
				<IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" /> */}

	return (
		<div
			className="my-5 flex items-center bg-white rounded-full shadow-[0px_0px_23px_-4px_rgba(0,_0,_0,_0.1)] p-2 w-full"
			style={{ width, height, margin }}
		>
			<div className="w-2/3 px-4 py-2 border-r border-gray-200">
				<label className={`block text-sm font-medium text-gray-900 px-3 ${showPlaceholder ? "" : "hidden"}`}>Where</label>
				<input
					type="text"
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleSearch}
					value={searchInput}
					placeholder={showPlaceholder ? "Search Locations" : "Where"}
					className="w-full text-[17px] text-gray-500 focus:outline-none px-3"
				/>
			</div>
			<div className="w-1/3 px-4 py-2 border-gray-200">
				<label className={`block text-sm font-medium text-gray-900 px-3 ${showPlaceholder ? "" : "hidden"}`}>Days</label>
				<input
					type="text"
					placeholder={showPlaceholder ? "Add Days" : "Days"}
					className="w-full text-[17px] text-gray-500 focus:outline-none px-3 "
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