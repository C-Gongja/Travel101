import { useCreateTrip } from "@/hooks/trip/useCreateTrip";
import { useTripStore } from "@/store/trip/trip-store";
import { useAuthModalStore } from "@/store/user/useAuthModalStore";
import { useUserStore } from "@/store/user/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BiTrip } from "react-icons/bi";

interface TripCreateBtnProps {
	text?: string;
	width?: string;
	height?: string;
	margin?: string;
}

const TripCreateBtn: React.FC<TripCreateBtnProps> = ({ text = "Create a New Trip", width = 'auto', height = 'auto', margin = '0' }) => {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();
	const { resetTripStore } = useTripStore();
	const { setAfterAuthCallback, onOpen } = useAuthModalStore();
	// const { mutate: createTrip, isPending, data, error } = useCreateTrip();

	const handleClickBuildTrip = () => {
		if (!isAuthenticated) {
			setAfterAuthCallback(() => {
				router.push('/trip');
			});
			onOpen();
			return;
		}
		resetTripStore();
		router.push('/trip');
		// localStorage.removeItem("tripId"); // 항상 tripId 제거
	};

	return (
		<>
			<button
				onClick={handleClickBuildTrip}
				style={{ width, height, margin }}
				className="flex justify-center items-center rounded-full bg-maincolor text-white gap-2 p-4 cursor-pointer
							transition duration-150 hover:scale-105 hover:bg-maindarkcolor hover:border-maincolor/60 hover:shadow-glow-main"
			>
				{text}
			</button>
		</>
	);
}

export default TripCreateBtn;