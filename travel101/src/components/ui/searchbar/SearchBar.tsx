import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx'; // clsx 임포트 확인

interface Props {
	width?: string;
	height?: string;
	margin?: string;
}

const SearchBar: React.FC<Props> = ({ width = '100%', height = 'auto', margin = '0' }) => {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState('');
	const [daysInput, setDaysInput] = useState('');
	const [isLocationFocused, setIsLocationFocused] = useState(false);
	const [isDaysFocused, setIsDaysFocused] = useState(false);
	const searchBarRef = useRef<HTMLDivElement>(null);

	// SearchBar 전체에 포커스 효과를 줄지 결정하는 상태
	const isAnyInputFocused = isLocationFocused || isDaysFocused;

	// Handle clicks outside the SearchBar to reset active states
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
				setIsLocationFocused(false);
				setIsDaysFocused(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Enter 키로 검색 실행
	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && searchInput.trim()) {
			router.push(`/search?keyword=${encodeURIComponent(searchInput)}`);
		}
	};

	return (
		<div
			ref={searchBarRef}
			// shadow-[0px_0px_23px_-4px_rgba(0,_0,_0,_0.1)] 이 부분을 제거하거나 기본 그림자로 활용
			className={clsx(
				"flex items-center bg-white border rounded-full p-2 w-full",
				"transition-all duration-300 ease-in-out", // 애니메이션 효과 추가
				{
					"border-maincolor shadow-glow-main": isAnyInputFocused, // 어느 하나라도 포커스되면 테두리 및 그림자 변경
					"border-maincolor/70 shadow-md": !isAnyInputFocused, // 포커스되지 않았을 때의 기본 테두리 및 그림자
				}
			)}
			style={{ width, height, margin }}
		>
			{/* Location Input */}
			<div className="relative w-2/3 px-4 py-2 border-r border-gray-300">
				<label
					className={`
            absolute left-5 transition-all duration-200 pointer-events-none 
            ${isLocationFocused || searchInput
							? 'text-base text-maincolor -top-2 scale-90 transform bg-white rounded-md px-2'
							: 'text-xl text-gray-400 top-2.5'}
          `}
				>
					Where
				</label>
				<input
					type="text"
					onFocus={() => setIsLocationFocused(true)}
					onBlur={() => setIsLocationFocused(false)}
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleSearch}
					value={searchInput}
					// 개별 input에서는 focus-visible을 활용하여 아웃라인을 제거하지 않고 커스텀 테두리를 유지
					// 이전에 input 자체에 border-color를 주지 않았으므로 여기서는 추가할 필요 없음.
					className="w-full text-[17px] text-gray-900 bg-transparent focus:outline-none pt-1 pb-1 px-3"
				/>
			</div>

			{/* Days Input */}
			<div className="relative w-1/3 px-4 py-2">
				<label
					className={`
            absolute left-5 transition-all duration-200 pointer-events-none 
            ${isDaysFocused || daysInput
							? 'text-base text-maincolor -top-2 scale-90 transform bg-white rounded-md px-2'
							: 'text-xl text-gray-400 top-2.5'}
          `}
				>
					Days
				</label>
				<input
					type="text"
					onFocus={() => setIsDaysFocused(true)}
					onBlur={() => setIsDaysFocused(false)}
					onChange={(e) => setDaysInput(e.target.value)}
					value={daysInput}
					className="w-full text-[17px] text-gray-900 bg-transparent focus:outline-none pt-1 pb-1 px-3"
				/>
			</div>

			{/* Search Button */}
			<button className="ml-2 p-2 bg-maincolor rounded-full text-white transition duration-150 hover:bg-maindarkcolor">
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