import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import FollowButton from "../buttons/follow/FollowButton";
import UnfollowButton from "../buttons/follow/UnfollowButton";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { useAuthModalStore } from "@/store/user/useAuthModalStore";

const UserSnippetCard: React.FC<{
	userSnippet: UserSnippet;
	toggleFollow?: (uuid: string, isFollowing: boolean) => void;
}> = ({ userSnippet, toggleFollow }) => {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();
	const { setAfterAuthCallback, onOpen } = useAuthModalStore();

	const handleProfileClick = () => {
		if (!isAuthenticated) {
			setAfterAuthCallback(() => {
				router.push(`/profile/${userSnippet?.uuid}`);
			});
			onOpen();
			return;
		}

		router.push(`/profile/${userSnippet?.uuid}`);
	};

	return (
		<div className="px-2 bg-white">
			<div className="flex justify-between items-center gap-2">
				<div
					onClick={handleProfileClick}
					className="flex flex-row items-center gap-3 cursor-pointer px-4 py-2">
					{/* Profile Image */}
					<div className="w-12 h-12">
						<img
							src={'/img/logo-color.png'}
							alt="thumbnail"
							className="object-cover rounded-full w-full h-full"
							onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
								(e.currentTarget.src = '')}
							loading="lazy"
						/>
					</div>

					{/* User Info */}
					<div className="">
						<h3 className="text-lg font-bold text-gray-900">{userSnippet?.name}</h3>
						<p className="text-sm text-gray-600">@{userSnippet?.username}</p>
					</div>
				</div>
				{(isAuthenticated && user?.uuid !== userSnippet?.uuid) && (
					userSnippet?.isFollowing ? (
						<UnfollowButton targetUser={userSnippet} onToggleFollow={toggleFollow} padding="6px 15px" rounded="rounded-full" />
					) : (
						<FollowButton targetUser={userSnippet} onToggleFollow={toggleFollow} padding="8px 23px" rounded="rounded-full" />
					)
				)}
			</div>
		</div>
	);
}

export default UserSnippetCard;