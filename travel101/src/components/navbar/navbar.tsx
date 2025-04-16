"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Modal from "../ui/modals/mainModal";

import { IoSearch } from "react-icons/io5";
import SignUpForm from "@/components/auth/signUpForm";
import SignInForm from "@/components/auth/signInForm";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user/user-store";

export default function Navbar() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { user, clearUser } = useUserStore();
	const isLoggedIn = !!user;
	const [menuOpen, setMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [searchInput, setSearchInput] = useState("");
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

	useEffect(() => {
		if (isModalOpen) {
			setIsSignUp(false);  // 모달이 열릴 때마다 로그인 폼을 기본으로 설정
		}
	}, [isModalOpen]);

	// Enter 키로 검색 실행
	const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			if (searchInput.trim()) {
				router.push(`/search?keyword=${encodeURIComponent(searchInput)}`);
			}
		}
	};

	const handleLogout = () => {
		queryClient.clear();
		clearUser();
	}

	return (
		<nav className="flex items-center justify-between bg-transparent px-6 py-3 rounded-full">
			<Link href="/" className="text-3xl font-bold text-maincolor">
				Sharavel
			</Link>

			<div className="relative w-1/3">
				<input
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleSearch}
					type="text"
					placeholder="Search..."
					value={searchInput}
					className="w-full border rounded-full py-2 px-4 pl-10 shadow-md focus:outline-none focus:ring-1 focus:ring-maincolor"
				/>
				<IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
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
					<div className="flex gap-2">
						<button
							onClick={() => setIsModalOpen(true)}
							className="px-4 py-2 bg-maincolor text-white rounded-full shadow-md">
							Sign In
						</button>
					</div>
				)}
			</div>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				{isSignUp ?
					<SignUpForm setIsSignUp={setIsSignUp} onClose={() => setIsModalOpen(false)} />
					:
					<SignInForm setIsSignUp={setIsSignUp} onClose={() => setIsModalOpen(false)} />
				}
			</Modal>
		</nav>
	);
}
