'use client'

import { useRouter } from 'next/navigation'
import { useUserStore } from "../../store/user/user-store";
import TripRecommandation from "../../components/home/TripRecommandation";
import { useState } from "react";
import { useCreateTrip } from "@/hooks/trip/useCreateTrip";
import { useQueryClient } from '@tanstack/react-query';
import LoginModal from '@/components/auth/AuthModal';
import HeroSection from '@/components/home/HeroSection';

export default function Home() {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();

	return (
		<div className="">
			<HeroSection
				isAuthenticated={isAuthenticated}
				user={user}
			/>
			<TripRecommandation />
		</div>
	);
}