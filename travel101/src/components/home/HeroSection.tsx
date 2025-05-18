import { useEffect, useState } from "react";
import SearchBar from "../ui/searchbar/SearchBar";
import { useSearchBarStore } from "@/store/ui/searchBar/useSearchBarStore";
import { useIsInView } from "./useIsInView";
import TripCreateBtn from "../ui/buttons/TripCreateBtn";

export default function HeroSection() {
	const { ref, isInView } = useIsInView();
	const setHeroVisible = useSearchBarStore((state) => state.setHeroVisible);

	useEffect(() => {
		setHeroVisible(isInView);
	}, [isInView]);

	return (
		<div ref={ref} className="mt-5">
			<div className="grid grid-cols-2 grid-rows-1 gap-4">
				<div className="m-5 justify-center">
					<h1 className="flex justify-center">Build Your Own Trip</h1>
					<div className="flex justify-center">
						<TripCreateBtn margin="20px 0px" />
					</div>
				</div>
				<div className="m-5">
					<h1 className="flex justify-center">Explore Trips</h1>
					<div className="flex justify-center">
						<SearchBar width="80%" height="70px" margin="20px 0px" />
					</div>
				</div>
			</div>
			<div className="border border-gray-200" />
		</div>
	);
}
