import { useEffect } from "react";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter } from "react-icons/fa";
import { useUserStore } from "@/store/user/user-store";
import { Country } from "@/types/trip/tripStoreTypes";

interface AccountInfoProps {
	uuid: string;
}

const AccountInfoCard: React.FC<AccountInfoProps> = ({ uuid }) => {
	const { user } = useUserStore();
	const { data: profile, isLoading } = useGetProfile(uuid);

	const platformIcons: Record<string, JSX.Element> = {
		Instagram: <FaInstagram />,
		Youtube: <FaYoutube />,
		Facebook: <FaFacebook />,
		Twitter: <FaTwitter />,
	};

	useEffect(() => {
		console.log("profile: ", profile);
	}, [profile])


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
						<p className="text-base text-gray-600">@{profile?.username}</p>

						<div className="flex gap-2 mt-4">
							{profile?.socialLinks?.map((link, idx) => (
								<a
									key={idx}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-2xl p-2 rounded-full bg-gray-800 text-white cursor-pointer hover:bg-gray-500"
								>
									{platformIcons[link.platform] || null}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
			{/* Follow Btn */}
			{user?.uid !== uuid && (
				<div className="mb-2">
					<button className="font-semibold py-2 w-full bg-maincolor rounded-md hover:bg-maindarkcolor">
						Follow
					</button>
				</div>
			)}
			{/* Trips | Followers | Following */}
			<div className="flex justify-center items-center gap-4 border-y py-4">
				<button className="flex items-baseline gap-2 text-gray-800 font-semibold hover:text-black transition duration-200">
					<span className="text">10.5K</span>
					<span className="text-sm font-normal text-gray-500">trips</span>
				</button>

				<div className="w-px h-5 bg-gray-300" />

				<button className="flex items-baseline gap-2 text-gray-800 font-semibold hover:text-black transition duration-200">
					<span className="text-base">15.3K</span>
					<span className="text-sm font-normal text-gray-500">followers</span>
				</button>

				<div className="w-px h-5 bg-gray-300" />

				<button className="flex items-baseline gap-2 text-gray-800 font-semibold hover:text-black transition duration-200">
					<span className="text">10.5K</span>
					<span className="text-sm font-normal text-gray-500">following</span>
				</button>
			</div>
			{/* Bio Section */}
			<div className="p-2">
				<p className="text-base text-gray-800">Explore Countries</p>
				<div className="flex gap-2">
					{profile?.countries && profile.countries.map((country: Country) => (
						<p key={country.iso2} className="text-2xl mt-1">{country.flag}</p>
					))}
				</div>
			</div>
			<div className="p-2">
				<p className="text-base text-gray-800">Explore Days</p>
				<p className="text-lg font-semibold text-gray-800">{profile?.totalTravelDays}</p>
			</div>
			<div className="p-2">
				<p className="text-base text-gray-800">{profile?.bio}</p>
			</div>
		</div>
	);
}

export default AccountInfoCard;