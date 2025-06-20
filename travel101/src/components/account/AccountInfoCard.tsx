import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter } from "react-icons/fa";
import { useUserStore } from "@/store/user/user-store";
import { Country } from "@/types/trip/tripStoreTypes";
import { SocialLink } from "@/types/user/userPersonalInfoTypes";
import UnfollowButton from "../ui/buttons/follow/UnfollowButton";
import FollowButton from "../ui/buttons/follow/FollowButton";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import Image from "next/image";

// 지금 여기 3번 rendering 되는중. 그니깐 총 6번이 rerendering이 되는중.

interface AccountInfoProps {
	uuid: string;
	setIsFollowingOpen: Dispatch<SetStateAction<boolean>>;
	setIsFollowersOpen: Dispatch<SetStateAction<boolean>>;
}

const AccountInfoCard: React.FC<AccountInfoProps> = ({ uuid, setIsFollowingOpen, setIsFollowersOpen }) => {
	const { user } = useUserStore();
	const { data: profileData, isLoading } = useGetProfile(uuid);
	const [userSnippet, setUserSnippet] = useState<UserSnippet>();

	console.log(user);

	useEffect(() => {
		setUserSnippet(profileData?.userSnippet);
	}, [profileData]);

	const toggleFollow = (uuid: string, isFollowing: boolean) => {
		setUserSnippet(prev =>
			prev?.uuid == uuid ? { ...prev, isFollowing } : prev
		);
	};

	const platformIcons: Record<string, any> = {
		Instagram: <FaInstagram />,
		Youtube: <FaYoutube />,
		Facebook: <FaFacebook />,
		Twitter: <FaTwitter />,
	};

	return (
		<div className="p-5 rounded-xl shadow-[0px_0px_15px_7px_rgba(0,_0,_0,_0.1)] 
		transition duration-150 bg-white">
			<div className="flex flex-row items-center gap-3 mb-4">
				{/* Profile Image */}
				<div className="w-28 h-28 mr-4">
					<Image
						src={user?.picture || '/img/logo-color.png'}
						alt="user pic"
						className="object-cover rounded-full border-2"
						width={120}
						height={120}
						onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
							(e.currentTarget.src = '')
						}
						loading="lazy"
					/>
				</div>

				{/* User Info */}
				<div className="flex-1">
					<div className="ml-3">
						<h3 className="text-3xl font-bold text-gray-900">{userSnippet?.name}</h3>
						<p className="text-base text-gray-600">@{userSnippet?.username}</p>

						<div className="flex gap-2 mt-4">
							{profileData?.socialLinks?.map((link: SocialLink, idx: number) => (
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
			<div className="mb-4 flex justify-center items-center">
				{(userSnippet && user?.uuid !== uuid) && (
					userSnippet?.isFollowing ? (
						<UnfollowButton targetUser={userSnippet} onToggleFollow={toggleFollow} width="100%" padding="8px 0px" rounded="rounded-xl" />
					) : (
						<FollowButton targetUser={userSnippet} onToggleFollow={toggleFollow} width="100%" padding="8px 0px" rounded="rounded-xl" />
					)
				)}
			</div>
			{/* Trips | Followers | Following */}
			<div className="flex justify-center items-center gap-4 border-y py-4">
				<button className="flex items-baseline gap-2 text-gray-800 font-semibold hover:text-black transition duration-200">
					<span className="text">{profileData?.totalTrips}</span>
					<span className="text-sm font-normal text-gray-500">trips</span>
				</button>

				<div className="w-px h-5 bg-gray-300" />

				<button
					className="flex items-baseline gap-2 text-gray-800 font-semibold hover:text-black transition duration-200"
					onClick={() => setIsFollowersOpen(true)}>
					<span className="text-base">{profileData?.followersCount}</span>
					<span className="text-sm font-normal text-gray-500">followers</span>
				</button>

				<div className="w-px h-5 bg-gray-300" />

				<button
					className="flex items-baseline gap-2 text-gray-800 font-semibold hover:text-black transition duration-200"
					onClick={() => setIsFollowingOpen(true)}>
					<span className="text">{profileData?.followingCount}</span>
					<span className="text-sm font-normal text-gray-500">following</span>
				</button>
			</div>
			{/* Bio Section */}
			<div className="p-2">
				<p className="text-base text-gray-800">Explore Countries</p>
				<div className="flex gap-2">
					{profileData?.countries && profileData.countries.map((country: Country) => (
						<p key={country.iso2} className="text-2xl mt-1">{country.flag}</p>
					))}
				</div>
			</div>
			<div className="p-2">
				<p className="text-base text-gray-800">Explore Days</p>
				<p className="text-lg font-semibold text-gray-800">{profileData?.totalTravelDays}</p>
			</div>
			<div className="p-2">
				<p className="text-base text-gray-800">{profileData?.bio}</p>
			</div>
		</div>
	);
}

export default AccountInfoCard;