import FollowButton from "@/components/ui/buttons/follow/FollowButton";
import UnfollowButton from "@/components/ui/buttons/follow/UnfollowButton";
import { useUserStore } from "@/store/user/user-store";
import { UserSnippet } from "@/types/user/userSnippetTypes";

// Follower Item Component
export const FollowItem: React.FC<{ follow: UserSnippet; }> = ({ follow }) => {
	const { user } = useUserStore();

	return (
		<div className="flex items-center justify-between py-3 px-4">
			<div className="flex items-center space-x-7">
				<img
					src={'/img/logo-color.png'}
					alt="thumbnail"
					className="object-cover rounded-full h-10"
					onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
						(e.currentTarget.src = '')
					}
					loading="lazy"
				/>
				<div>
					<p className="font-semibold">{follow.name}</p>
					<p className="text-sm">{follow.username}</p>
				</div>
			</div>
			{user?.uid !== follow.uuid && (
				follow?.isFollowing ? (
					<UnfollowButton targetUser={follow} width="40%" padding="8px 0px" rounded="rounded-xl" />
				) : (
					<FollowButton targetUser={follow} width="40%" padding="8px 0px" rounded="rounded-xl" />
				)
			)}
		</div>
	);
};