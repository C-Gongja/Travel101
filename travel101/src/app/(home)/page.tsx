'use client'

import Link from "next/link";
import { useUserStore } from "../store/user/user-store";
import { BiTrip } from "react-icons/bi";
import TripRecommandation from "./components/TripRecommandation";

export default function Home() {
	const { user, isAuthenticated } = useUserStore();

	const handleClickBuildTrip = () => {
		localStorage.removeItem("tripId");
	}

	return (
		<div className="pt-[50px]">
			<h1 className="flex justify-center"> {isAuthenticated ? `Welcome, ${user?.name}` : "Not logged in"}</h1>
			<Link href="/buildTrip">
				<div
					onClick={handleClickBuildTrip}
					className="flex justify-center items-center bg-maincolor text-white gap-2 p-5 h-[50px] w-auto cursor-pointer"
				>
					Make your trip! <BiTrip className="text-2xl" />
				</div>
			</Link>
			<TripRecommandation />
		</div>
	);
}