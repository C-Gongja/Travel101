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
	isLoading?: boolean;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
	text = "Create a New Trip",
	width = 'auto',
	height = 'auto',
	padding = '0',
	margin = '0',
	isLoading = false,
	onClick
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { user, isAuthenticated } = useUserStore();
	const { mutate: createTrip, isPending, data, error } = useCreateTrip();

	return (
		<>
			<button
				onClick={onClick}
				type="button"
				style={{ width, height, padding, margin }}
				// onClick={saveHandler}
				disabled={isLoading}
				className="bg-maincolor text-white rounded-full hover:bg-maindarkcolor transition duration-150 "
			>
				{text}
			</button>
		</>
	);
}

export default Button;