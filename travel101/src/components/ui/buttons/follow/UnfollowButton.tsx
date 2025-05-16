import { UnfollowUser } from "@/api/account/follow/FollowApi";
import { useTripStore } from "@/store/trip/trip-store";
import { useSnippetStore } from "@/store/user/user-profile-store";

interface ButtonProps {
	targetUser: any;
	width?: string;
	height?: string;
	padding?: string;
	margin?: string;
	rounded?: string;
}

const UnfollowButton: React.FC<ButtonProps> = ({ targetUser, width = 'auto', height = 'auto', padding = '0', margin = '0', rounded = 'rounded-none' }) => {
	const { tripOwner, updateTripOwner } = useTripStore();
	const { updateUserSnippet } = useSnippetStore();

	const handleFollowClick = () => {
		if (targetUser?.isFollowing) {
			UnfollowUser(targetUser?.uuid);
			updateTripOwner("isFollowing", false);
			updateUserSnippet("isFollowing", false);
		}
	}

	return (
		<>
			<button
				onClick={handleFollowClick}
				type="button"
				style={{ width, height, padding, margin }}
				className={`border-[1px] border-maincolor text-maincolor ${rounded} hover:bg-maincolor hover:text-white transition duration-150`}
			>
				Unfollow
			</button>
		</>
	);
}

export default UnfollowButton;