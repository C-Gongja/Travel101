import { useEffect } from "react";
import { useFetchProfile } from "@/hooks/profile/useFetchProfile";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/store/trip/trip-store";


const UserSnippetCard = () => {
	const router = useRouter();
	const { tripOwner } = useTripStore();

	const handleProfileClick = () => {
		router.push(`/profile/${tripOwner?.uuid}`);
	}

	return (
		<div className="px-2 pb-6 bg-white">
			<p className="text-xl font-semibold mb-4">Explorer</p>
			<div
				onClick={handleProfileClick}
				className="flex flex-row items-center gap-3 cursor-pointer px-4 py-2 w-fit">
				{/* Profile Image */}
				<div className="w-12 h-12 mr-0">
					<img
						src={'/img/logo-color.png'}
						alt="thumbnail"
						className="object-cover rounded-full"
						onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
							(e.currentTarget.src = '')
						}
						loading="lazy"
					/>
				</div>

				{/* User Info */}
				<div className="flex-1">
					<div className="ml-3">
						<h3 className="text-lg font-bold text-gray-900">{tripOwner?.name}</h3>
						<p className="text-sm text-gray-600">{tripOwner?.username}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserSnippetCard;