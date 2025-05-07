import { FollowUser, UnfollowUser } from "@/api/account/follow/FollowApi";
import { useTripStore } from "@/store/trip/trip-store";

interface ButtonProps {
	width?: string;
	height?: string;
	padding?: string;
	margin?: string;
}

const UnfollowButton: React.FC<ButtonProps> = ({ width = 'auto', height = 'auto', padding = '0', margin = '0' }) => {
	const { tripOwner, updateTripOwner } = useTripStore();

	const handleFollowClick = () => {
		if (tripOwner?.isFollowing) {
			UnfollowUser(tripOwner?.uuid);
			updateTripOwner("isFollowing", false);
		}
	}

	return (
		<>
			<button
				onClick={handleFollowClick}
				type="button"
				style={{ width, height, padding, margin }}
				className=" text-maincolor border-[1px] border-maincolor rounded-full hover:bg-maincolor hover:text-white transition duration-150 "
			>
				Unfollow
			</button>
		</>
	);
}

export default UnfollowButton;