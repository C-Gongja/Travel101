import { useEffect } from "react";
import { useFetchProfile } from "@/hooks/profile/useFetchProfile";
import { FaInstagram, FaYoutube } from "react-icons/fa6";

interface AccountInfoProps {
	uuid: string;
}

const AccountInfoCard: React.FC<AccountInfoProps> = ({ uuid }) => {
	const { data: profile, isLoading } = useFetchProfile(uuid);

	return (
		<div className="p-5 rounded-xl shadow-[0px_0px_15px_7px_rgba(0,_0,_0,_0.1)] 
		transition duration-150 bg-white">
			<div className="flex flex-row items-center gap-3 mb-4">
				{/* Profile Image */}
				<div className="w-28 h-28 mr-4">
					<img
						src={'/img/logo-color.png'}
						alt="thumbnail"
						className="object-cover rounded-full border-2"
						onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
							(e.currentTarget.src = '')
						}
						loading="lazy"
					/>
				</div>

				{/* User Info */}
				<div className="flex-1">
					<div className="ml-3">
						<h3 className="text-3xl font-bold text-gray-900">{profile?.name}</h3>
						<p className="text-base text-gray-600">{profile?.username}</p>
						<div className="flex gap-2 mt-4">
							<FaInstagram className="text-4xl p-2 rounded-full bg-gray-800 text-white cursor-pointer hover:bg-gray-500" />
							<FaYoutube className="text-4xl p-2 rounded-full bg-gray-800 text-white cursor-pointer hover:bg-gray-500" />
						</div>
					</div>
				</div>
			</div>
			{/* Following Followers */}
			<div className="flex py-3 gap-4 justify-center items-center border-y">
				<button
					className="flex flex-row gap-2 px-2 text-gray-800 border-b border-transparent hover:border-gray-700 transition duration-150"
				>
					Following <span className="font-semibold">200</span>
				</button>
				<div className="w-px h-6 bg-gray-300 self-center"></div>
				<button
					className="flex flex-row gap-2 px-2 text-gray-800 border-b border-transparent hover:border-gray-700 transition duration-150"
				>
					Followers <span className="font-semibold">50K</span>
				</button>
			</div>
			{/* Bio Section */}
			<div className="p-2">
				<p className="text-lg font-semibold text-gray-800">Total Travel Countries</p>
				<p className="text-2xl text-gray-800">🇺🇸 🇯🇵 🇰🇷 🇩🇪</p>
			</div>
			<div className="p-2">
				<p className="text-lg font-semibold text-gray-800">Total Travels</p>
				<p className="text-base text-gray-800">4 trips 30 days</p>
			</div>
			<div className="p-2">
				<p className="text-base font-semibold text-gray-800">글자수 제한 걸어라. Hi, I'm a traveler who loves peaceful journeys.
					I enjoy exploring the world's breathtaking landscapes and experiencing the beauty of nature firsthand.
					Every adventure is a chance to find new inspiration and connect with the world in a deeper way.</p>
			</div>
		</div>
	);
}

export default AccountInfoCard;