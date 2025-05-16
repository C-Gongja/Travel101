'use client'

import { useGetFollowing } from "@/hooks/profile/useGetFollowing";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { useParams } from "next/navigation";
import { FaSearch } from 'react-icons/fa';
import { FollowItem } from "./FollowItem";

export default function FollowingModal() {
	const { uuid } = useParams<{ uuid: string }>();
	const { data: followings, isLoading, error } = useGetFollowing(uuid);

	return (
		<div className="w-full max-w-[400px] min-w-[300px]">
			<div className="flex justify-center items-center px-4 pb-3 border-b border-gray-700">
				<h2 className="text-xl font-semibold">Followers</h2>
			</div>

			{/* 화면 사이즈에 맞춰서 w 조절 어떻게 하더라... */}
			<div className="px-4 py-3">
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search"
						// value={searchQuery}
						// onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
					/>
				</div>
			</div>

			<div className="max-h-[300px] overflow-y-auto">
				{isLoading || followings.length === 0 ? (
					<p className="text-gray-400 text-center py-4">No followers found</p>
				) : (
					followings.map((following: UserSnippet) => (
						<FollowItem
							key={following.uuid}
							follow={following}
						/>
					))
				)}
			</div>
		</div>
	);
}