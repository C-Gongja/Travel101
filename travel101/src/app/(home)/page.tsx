'use client'

import { useRouter } from 'next/navigation'
import TripRecommandation from "../../components/home/TripRecommandation";
import { useState } from "react";
import HeroSection from '@/components/home/HeroSection';

export default function Home() {
	const router = useRouter();

	return (
		<div className="">
			<HeroSection />
			<TripRecommandation />
			<div>Top Explorer</div>
			<TripRecommandation />
			<div>Top Advanturer</div>
		</div>
	);
}