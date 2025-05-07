import { FollowUser, UnfollowUser } from "@/api/account/follow/FollowApi";
import { useTripStore } from "@/store/trip/trip-store";

interface ButtonProps {
	width?: string;
	height?: string;
	padding?: string;
	margin?: string;
}

const FollowButton: React.FC<ButtonProps> = ({ width = 'auto', height = 'auto', padding = '0', margin = '0' }) => {
	const { tripOwner, updateTripOwner } = useTripStore();
	console.log("tripOwner: ", tripOwner);

	const handleFollowClick = () => {
		if (!tripOwner?.isFollowing && tripOwner?.isFollowing !== undefined) {
			FollowUser(tripOwner?.uuid)
			updateTripOwner("isFollowing", true);
		}
	}

	return (
		<>
			<button
				onClick={handleFollowClick}
				type="button"
				style={{ width, height, padding, margin }}
				className="bg-maincolor text-white rounded-full hover:bg-maindarkcolor transition duration-150 "
			>
				Follow
			</button>
		</>
	);
}

export default FollowButton;