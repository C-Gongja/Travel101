import { FollowUser, UnfollowUser } from "@/api/account/follow/FollowApi";
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

const FollowButton: React.FC<ButtonProps> = ({ targetUser, width = 'auto', height = 'auto', padding = '0', margin = '0', rounded = 'rounded-none' }) => {
	const { tripOwner, updateTripOwner } = useTripStore();
	const { updateUserSnippet } = useSnippetStore();
	console.log("tripOwner: ", tripOwner);

	const handleFollowClick = () => {
		if (!targetUser?.isFollowing && targetUser?.isFollowing !== undefined) {
			FollowUser(targetUser?.uuid)
			updateTripOwner("isFollowing", true);
			updateUserSnippet("isFollowing", true);
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