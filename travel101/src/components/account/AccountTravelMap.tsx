import { useEffect } from "react";
import { useFetchProfile } from "@/hooks/profile/useFetchProfile";
import { CgProfile } from "react-icons/cg";

interface AccountTravelMapProps {
	uuid: string;
}

const AccountTravelMap: React.FC<AccountTravelMapProps> = ({ uuid }) => {
	const { data: profile, isLoading } = useFetchProfile(uuid);

	return (
		<div className="p-5 rounded-xl shadow-[0px_0px_15px_7px_rgba(0,_0,_0,_0.1)] 
		transition duration-150 bg-white">
			<div className="flex flex-row items-center gap-3 mb-3">
				{/* Profile Image */}
				<div className="w-full mr-4">
					<img
						src={'/img/worldmap.png'}
						alt="thumbnail"
						className="object-cover rounded-full bg-gray-400"
						onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
							(e.currentTarget.src = '')
						}
						loading="lazy"
					/>
				</div>
			</div>
			{/* Sub Section */}
		</div>
	);
}

export default AccountTravelMap;