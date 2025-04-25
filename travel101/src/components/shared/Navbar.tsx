"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user/user-store";
import AuthModal from "../auth/AuthModal";
import SearchBar from "../ui/searchbar/SearchBar";

export default function Navbar() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { user, clearUser } = useUserStore();
	const isLoggedIn = !!user;
	const [menuOpen, setMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 참조

	// 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setMenuOpen(false); // 드롭다운 외부 클릭 시 닫기
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
		<nav className="fixed top-0 w-full flex items-center justify-between bg-white px-[150px] py-5 rounded-b-lg z-50">
			<Link href="/" className="text-3xl font-bold text-maincolor">
				Sharavel
			</Link>

			<div className="relative w-1/3">
				<SearchBar width="100%" height="50px" />
			</div>

			<div className="flex items-center gap-4">
				{isLoggedIn ? (
					<div className="relative" >
						<button onClick={() => setMenuOpen(!menuOpen)}>
							<Image
								src={user.picture || '/default-profile.png'}
								alt="User Profile"
								width={40}
								height={40}
								className="rounded-full cursor-pointer shadow-md"
							/>
						</button>

						{menuOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
								<Link
									href={`/profile/${user.uid}`}
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
							onClick={() => setIsModalOpen(true)}
							className="px-4 py-2 bg-maincolor text-white rounded-full shadow-[0px_0px_23px_-4px_rgba(0,_0,_0,_0.1)] 
							transition duration-150 hover:bg-maindarkcolor">
							Sign In
						</button>
					</div>
				)}
			</div>

			<AuthModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				isSignUp={isSignUp}
				setIsSignUp={setIsSignUp}
			/>
		</nav>
	);
}
