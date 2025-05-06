import { useCreateTrip } from "@/hooks/trip/useCreateTrip";
import { useUserStore } from "@/store/user/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BiTrip } from "react-icons/bi";

interface ButtonProps {
	text?: string;
	width?: string;
	height?: string;
	padding?: string;
	margin?: string;
}

const FollowButton: React.FC<ButtonProps> = ({ text = "Follow", width = 'auto', height = 'auto', padding = '0', margin = '0' }) => {
	const queryClient = useQueryClient();
	const { user, isAuthenticated } = useUserStore();

	const handleFollowClick = () => {
		
	}

	return (
		<>
			<button
				onClick={handleFollowClick}
				type="button"
				style={{ width, height, padding, margin }}
				// onClick={saveHandler}
				className="bg-maincolor text-white rounded-full hover:bg-maindarkcolor transition duration-150 "
			>
				{text}
			</button>
		</>
	);
}

export default FollowButton;