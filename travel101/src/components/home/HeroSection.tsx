import { useState } from "react";
import { BiTrip } from "react-icons/bi";
import SearchBar from "../ui/searchbar/SearchBar";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTrip } from "@/hooks/trip/useCreateTrip";
import { useRouter } from "next/navigation";

export default function HeroSection({
	isAuthenticated,
	user,
}: {
	isAuthenticated: boolean | null;
	user: any;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate: createTrip, isPending, data, error } = useCreateTrip();
	const [searchInput, setSearchInput] = useState("");

	const handleClickBuildTrip = () => {
		if (isAuthenticated) {
			createTrip(undefined, {
				onSuccess: ({ trip, editable, redirectUrl }) => {
					const createdTrip = {
						trip,
						editable, // editable 속성을 추가
					};
					queryClient.setQueryData(['trip', trip.uuid], createdTrip);
					console.log("redirectUrl: ", redirectUrl);
					router.push(redirectUrl);
				},
			});
		} else {
			//use contextapi or zustand to manage this
			setIsModalOpen(true); // 로그인 안 된 경우 모달 열기
		}
		localStorage.removeItem("tripId"); // 항상 tripId 제거
	};

	return (
		<div className="mt-5">
			<div className="grid grid-cols-2 grid-rows-1 gap-4">
				<div className="">
					<img
						src={"/img/hero.png" || ''}
						alt="hero image"
						className="object-cover rounded-xl"
						onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
							(e.currentTarget.src = '')
						}
						loading="lazy"
					/>
				</div>
				<div className="m-5">
					<h1>Explore Trips</h1>
					<SearchBar width="80%" height="70px" margin="20px 0px" />
					<h1>Build Your Own Trip</h1>
					<button
						onClick={handleClickBuildTrip}
						className="my-5 flex justify-center items-center rounded-xl bg-maincolor text-white gap-2 p-5 h-[50px] w-auto cursor-pointer
          transition duration-150 hover:scale-105 hover:bg-maindarkcolor"
					>
						Make your trip! <BiTrip className="text-2xl" />
					</button>
				</div>
			</div>
		</div>
	);
}
