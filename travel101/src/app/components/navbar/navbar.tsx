"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useUserStore } from "../stateManagement/user/user-store";
import Modal from "../modals/mainModal";
import SignInForm from "../auth/signInForm";
import SignUpForm from "../auth/signUpForm";

import { IoSearch } from "react-icons/io5";

export default function Navbar() {
	const router = useRouter();
	const { user, verifyUser, clearUser } = useUserStore();
	const isLoggedIn = !!user;
	const [menuOpen, setMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);

	useEffect(() => {
		if (isModalOpen) {
			setIsSignUp(false);  // 모달이 열릴 때마다 로그인 폼을 기본으로 설정
		}
	}, [isModalOpen]);

	useEffect(() => {
		verifyUser();
	}, []);

	const handleLogout = () => {
		clearUser();
	}

	return (
		<nav className="flex items-center justify-between bg-transparent px-6 py-3 rounded-full">
			<Link href="/" className="text-3xl font-bold text-maincolor">
				Sharavel
			</Link>

			{/* search bar */}
			<div className="relative w-1/3">
				<input
					type="text"
					placeholder="Search..."
					className="w-full border rounded-full py-2 px-4 pl-10 shadow-md focus:outline-none focus:ring-2 focus:ring-maincolor"
				/>
				{/* 아이콘을 input 안에 위치시키기 위해 absolute로 positioning */}
				<IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
			</div>


			{/* signin / profile */}
			<div className="flex items-center gap-4">
				{isLoggedIn ? (
					<div className="relative">
						<button onClick={() => setMenuOpen(!menuOpen)}>
							<Image
								src={user.profileImage || null}
								alt="User Profile"
								width={40}
								height={40}
								className="rounded-full cursor-pointer shadow-md"
							/>
						</button>

						{/* drop down */}
						{menuOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
								<Link href="/profile" className="block px-4 py-2 text-black hover:bg-gray-100 ">
									Profile
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

			{/* 로그인 모달 */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				{isSignUp ? <SignUpForm setIsSignUp={setIsSignUp} onClose={() => setIsModalOpen(false)} /> : <SignInForm setIsSignUp={setIsSignUp} onClose={() => setIsModalOpen(false)} />}
			</Modal>
		</nav>
	);
}
