'use client'

import { useUserStore } from "../../../store/user/user-store";
import { useParams } from "next/navigation";
import UserTrips from "@/components/account/profile/UserTrips";
import AccountInfoCard from "@/components/account/AccountInfoCard";
import AccountTravelMap from "@/components/account/AccountTravelMap";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import Modal from "@/components/ui/modals/MainModal";
import FollowingModal from "@/components/account/profile/follow/FollowingModal";
import FollowersModal from "@/components/account/profile/follow/FollowersModal";

export default function ProfilePage() {
	const { uuid } = useParams<{ uuid: string }>();
	const { user, clearUser } = useUserStore();
	const [isFollowingOpen, setIsFollowingOpen] = useState(false);
	const [isFollowersOpen, setIsFollowersOpen] = useState(false);

	return (
		<div className="px-[100px]">
			<div className="mb-6 flex gap-3 items-center">
				<h1 className="">Profiles</h1>
				{user?.uid === uuid &&
					(<Link href={`/user/personalInfo/${user?.uid}`} className="text-3xl">
						<IoSettingsOutline />
					</Link>)
				}
			</div>
			<div className="grid grid-cols-[35%_65%] h-auto gap-10">
				<AccountInfoCard uuid={uuid} setIsFollowingOpen={setIsFollowingOpen} setIsFollowersOpen={setIsFollowersOpen} />
				<AccountTravelMap uuid={uuid} />
			</div>
			<div>
				<div className="mt-10 mb-5">
					<h2> {user?.name}'s Trips</h2>
				</div>
				<UserTrips uuid={uuid} />
			</div>

			<div className="pt-10">
				<button
					onClick={clearUser}
					className="p-2 border border-red-600"
				>
					Logout
				</button>
			</div>

			{isFollowersOpen && (
				<Modal isOpen={isFollowersOpen} onClose={() => setIsFollowersOpen(false)}>
					<FollowersModal />
				</Modal>
			)}
			{isFollowingOpen && (
				<Modal isOpen={isFollowingOpen} onClose={() => setIsFollowingOpen(false)}>
					<FollowingModal />
				</Modal>
			)}
		</div>
	);
}
