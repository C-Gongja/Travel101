import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import FollowButton from "../buttons/follow/FollowButton";
import UnfollowButton from "../buttons/follow/UnfollowButton";
import { useSnippetStore } from "@/store/user/user-profile-store";

const UserSnippetCard = () => {
	const router = useRouter();
	const { user } = useUserStore();
	const { userSnippet } = useSnippetStore();

	const handleProfileClick = () => {
		router.push(`/profile/${userSnippet?.uuid}`);
	}

	return (
		<div className="px-2 pb-6 bg-white">
			<p className="text-xl font-semibold mb-4">Explorer</p>
			<div className="flex gap-2 items-center">
				<div
					onClick={handleProfileClick}
					className="flex flex-row items-center gap-3 cursor-pointer px-4 py-2 w-fit">
					{/* Profile Image */}
					<div className="w-12 h-12 mr-0">
						<img
							src={'/img/logo-color.png'}
							alt="thumbnail"
							className="object-cover rounded-full"
							onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
								(e.currentTarget.src = '')
							}
							loading="lazy"
						/>
					</div>

					{/* User Info */}
					<div className="flex-1 ml-3">
						<h3 className="text-lg font-bold text-gray-900">{userSnippet?.name}</h3>
						<p className="text-sm text-gray-600">@{userSnippet?.username}</p>
					</div>
				</div>
				{user?.uid !== userSnippet?.uuid && (
					userSnippet?.isFollowing ? (
						<UnfollowButton targetUser={userSnippet} padding="10px 30px" rounded="rounded-full" />
					) : (
						<FollowButton targetUser={userSnippet} padding="10px 30px" rounded="rounded-full" />
					)
				)}
			</div>
		</div>
	);
}

export default UserSnippetCard;