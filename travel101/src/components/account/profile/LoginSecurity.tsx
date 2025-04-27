import { useEffect } from "react";
import { useFetchProfile } from "@/hooks/profile/useFetchProfile";
import { MdOutlineSecurity } from "react-icons/md";

interface LoginSecurityProps {
	uuid: string;
}

const LoginSecurity: React.FC<LoginSecurityProps> = ({ uuid }) => {
	return (
		<div className="p-5 rounded-xl shadow-[0px_0px_15px_7px_rgba(0,_0,_0,_0.1)] transition duration-150 bg-white cursor-pointer hover:scale-105" >
			<div className="flex flex-row items-center gap-3 mb-3" >
				<MdOutlineSecurity className="text-4xl" />
				<p className="text-2xl font-semibold" > Security </p>
			</div>
		</div>
	);
}

export default LoginSecurity;