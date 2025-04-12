'use client'

import { useRouter } from 'next/navigation'
import { useUserStore } from "../../store/user/user-store";
import { BiTrip } from "react-icons/bi";
import TripRecommandation from "./components/TripRecommandation";
import { useState } from "react";
import Modal from "@/components/ui/modals/mainModal";
import SignUpForm from "@/components/auth/signUpForm";
import SignInForm from "@/components/auth/signInForm";
import { useCreateTrip } from "@/hooks/trip/useCreateTrip";
import { useQueryClient } from '@tanstack/react-query';

export default function Home() {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();
	const queryClient = useQueryClient();
	const { mutate: createTrip, isPending, data, error } = useCreateTrip();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);

	const handleClickBuildTrip = () => {
		if (isAuthenticated) {
			createTrip(undefined, {
				onSuccess: ({ trip, editable, redirectUrl }) => {
					const createdTrip = {
						trip,
						editable, // editable 속성을 추가
					};
					queryClient.setQueryData(['trip', trip.uuid], createdTrip);
					router.push(redirectUrl);
				},
			});
		} else {
			setIsModalOpen(true); // 로그인 안 된 경우 모달 열기
		}
		localStorage.removeItem("tripId"); // 항상 tripId 제거
	};

	return (
		<div className="pt-[50px]">
			<h1 className="flex justify-center"> {isAuthenticated ? `Welcome, ${user?.name}` : "Start Your Trip!"}</h1>
			<div className="flex justify-center mt-6">
				<button
					onClick={handleClickBuildTrip}
					className="flex justify-center items-center rounded-xl bg-maincolor text-white gap-2 p-5 h-[50px] w-auto cursor-pointer
					transition duration-150 hover:scale-105"
				>
					Make your trip! <BiTrip className="text-2xl" />
				</button>
			</div>
			<TripRecommandation />

			{/* 로그인 모달 */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				{isSignUp ? (
					<SignUpForm setIsSignUp={setIsSignUp} onClose={() => setIsModalOpen(false)} />
				) : (
					<SignInForm setIsSignUp={setIsSignUp} onClose={() => setIsModalOpen(false)} />
				)}
			</Modal>
		</div>
	);
}