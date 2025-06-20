"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user/user-store";
import AuthModal from "../auth/AuthModal";
import SearchBar from "../ui/searchbar/SearchBar";
import { useSearchBarStore } from "@/store/ui/searchBar/useSearchBarStore";
import TripCreateBtn from "../ui/buttons/trip/TripCreateBtn";
import { useAuthModalStore } from "@/store/user/useAuthModalStore";

export default function Navbar() {
	const isHeroVisible = useSearchBarStore((state) => state.isHeroVisible);
	const queryClient = useQueryClient();
	const { onOpen } = useAuthModalStore();
	const { isAuthenticated, user, clearUser } = useUserStore();
	const [menuOpen, setMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const router = useRouter();
	const pathname = usePathname();
	const isHome = pathname === '/';
	const showSearchAndTrip = !isHome || !isHeroVisible;

	// close dropdown when user click outside 
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};
		// 문서에 클릭 이벤트 리스너 추가
		document.addEventListener('mousedown', handleClickOutside);
		// 컴포넌트 언마운트 시 리스너 제거
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		queryClient.clear();
		clearUser();
	}

	return (
		<nav className={`fixed top-0 w-full flex items-center justify-between bg-white px-[150px] py-5 z-50
			${showSearchAndTrip ? 'border-b border-gray-200 shadow-sm' : ''
			}`}>
			<Link href="/" className="text-3xl font-bold text-maincolor">
				Sharavel
			</Link>

			{showSearchAndTrip && (
				<div className="flex items-center gap-4 w-1/2">
					<SearchBar width="70%" height="47px" />
					<TripCreateBtn text="New Trip" height="45px" width="120px" />
				</div>
			)}

			<div className="flex items-center gap-4">
				{isAuthenticated ? (
					<div className="relative" >
						<button onClick={() => setMenuOpen(!menuOpen)}>
							<Image
								src={user?.picture || '/img/logo-color.png'}
								alt="User Profile"
								width={40}
								height={40}
								className="rounded-full cursor-pointer border border-maincolor shadow-[0px_0px_17px_0px_rgba(0,_0,_0,_0.1)]"
							/>
						</button>

						{menuOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white shadow-[0px_0px_17px_0px_rgba(0,_0,_0,_0.1)] rounded-lg py-2 "
								ref={dropdownRef}>
								<Link
									href={`/profile/${user?.uuid}`}
									className="block px-4 py-2 text-black hover:bg-gray-100 "
									onClick={() => setMenuOpen(false)}>
									Account
								</Link>
								<button
									onClick={() => handleLogout()}
									className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
								>
									Logout
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="">
						<button
							onClick={() => onOpen()}
							className="px-4 py-2 bg-maincolor text-white rounded-full shadow-[0px_0px_23px_-4px_rgba(0,_0,_0,_0.1)] 
							transition duration-150 hover:bg-maindarkcolor">
							Sign In
						</button>
					</div>
				)}
			</div>

			<AuthModal />
		</nav>
	);
}