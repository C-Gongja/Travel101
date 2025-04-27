"use client";

import { fetchSearch } from "@/api/search/searchApi";
import { useTripSearchStore } from "@/store/search/tripSearch-store";
import TripCard from "@/components/ui/card/TripCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
	const searchParams = useSearchParams();
	const { searchedTrips, setSearchedTrips } = useTripSearchStore();
	const keyword = searchParams.get("keyword") || "";

	useEffect(() => {
		if (keyword) {
			fetchSearch(keyword).then((res) => {
				if (res) setSearchedTrips(res);
			});
		}
	}, [keyword]);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Search Results for: "{keyword}"</h1>

			{searchedTrips?.length === 0 ? (
				<p>No results found.</p>
			) : (
				<div>
					{searchedTrips && Array.isArray(searchedTrips) && searchedTrips.length > 0 ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{searchedTrips.map((trip) => (
								<TripCard key={trip.tripUid} trip={trip} />
							))}
						</ul>
					) : (
						<p>No trips available</p>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchPage;
