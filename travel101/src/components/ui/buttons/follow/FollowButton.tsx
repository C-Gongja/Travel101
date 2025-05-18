import { FollowUser } from "@/api/account/follow/FollowApi";
import { UserSnippet } from "@/types/user/userSnippetTypes";

interface ButtonProps {
	targetUser: UserSnippet;
	onToggleFollow?: (uuid: string, isFollowing: boolean) => void;
	width?: string;
	height?: string;
	padding?: string;
	margin?: string;
	rounded?: string;
}

const FollowButton: React.FC<ButtonProps> = ({ targetUser, onToggleFollow, width = 'auto', height = 'auto', padding = '0', margin = '0', rounded = 'rounded-none' }) => {
	// const { updateTripOwner } = useTripStore();

	const handleFollowClick = () => {
		if (!targetUser?.isFollowing && targetUser?.isFollowing !== undefined) {
			FollowUser(targetUser?.uuid);
			onToggleFollow?.(targetUser.uuid, true);
			// updateTripOwner("isFollowing", true);
		}
	}

	return (
		<>
			<button
				onClick={handleFollowClick}
				type="button"
				style={{ width, height, padding, margin }}
				className={`bg-maincolor text-white ${rounded} hover:bg-maindarkcolor transition duration-150`}
			>
				Follow
			</button>
		</>
	);
}

export default FollowButton;