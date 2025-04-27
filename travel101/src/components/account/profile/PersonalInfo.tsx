import { useEffect } from "react";
import { useFetchProfile } from "@/hooks/profile/useFetchProfile";
import { CgProfile } from "react-icons/cg";

interface PersonalInfoProps {
	uuid: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ uuid }) => {
	const { data: profile, isLoading } = useFetchProfile(uuid);

	return (
		<div className="p-5 rounded-xl shadow-[0px_0px_15px_7px_rgba(0,_0,_0,_0.1)] 
		transition duration-150 bg-white cursor-pointer hover:scale-105">
			<div className="flex flex-row items-center gap-3 mb-3">
				<CgProfile className="text-4xl" />
				<p className="text-2xl font-semibold">Personal Information</p>
			</div>
			<div className="">
				<p>Email: {profile?.email || "Email not available"}</p>
				<p>Name: {profile?.name || "Name not available"}</p>
				<p>Username: {profile?.username || "Set username"}</p>
				<p>Region: {profile?.country ? profile?.country : "Set your region"}</p>
			</div>
		</div>
	);
}

export default PersonalInfo;