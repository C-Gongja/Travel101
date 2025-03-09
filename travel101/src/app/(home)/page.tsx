'use client'

import Link from "next/link";
import { useUserStore } from "../components/stateManagement/user-store";
import { BiTrip } from "react-icons/bi";

export default function Home() {
	const { user, isAuthenticated } = useUserStore();

	return (
		<div className="pt-[50px]">
			<h1 className="flex justify-center"> {isAuthenticated ? `Welcome, ${user?.name}` : "Not logged in"}</h1>
			<Link href="/buildTrip" className="flex justify-center items-center bg-maincolor text-white gap-2 p-5 h-[50px] w-auto">
				Make your trip! <BiTrip className="text-2xl" />
			</Link>
			<h1>Main</h1>
		</div>
	);
}