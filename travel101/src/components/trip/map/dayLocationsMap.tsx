'use client';

import { useTripStore } from "@/store/trip/trip-store";
import CustomMarker from "./CustomMarker";
import { Polyline, useGoogleMap } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const DayLocationsMap = () => {
	const { trip, selectedDay } = useTripStore();
	const map = useGoogleMap();
	const currentDay = trip?.days.find((day) => day.number === selectedDay);
	const locations = currentDay?.locations || [];
	const polylineRef = useRef<google.maps.Polyline | null>(null);

	useEffect(() => {
		const newPath = locations
			.filter((location) => location.latitude && location.longitude)
			.map((location) => ({
				lat: location.latitude!,
				lng: location.longitude!,
			}));

		// delete previous Polyline
		if (polylineRef.current && map) {
			polylineRef.current.setMap(null);
			polylineRef.current = null;
		}

		// new Polyline
		if (newPath.length > 1 && map) {
			const polyline = new google.maps.Polyline({
				path: newPath,
				strokeColor: "#646cff",
				strokeOpacity: 0,
				strokeWeight: 1,
				icons: [
					{
						icon: {
							path: "M 0,-2 0,2",
							strokeOpacity: 1,
							scale: 2,
						},
						offset: "0",
						repeat: "15px",
					},
				],
			});
			polyline.setMap(map);
			polylineRef.current = polyline;
		}
	}, [locations, selectedDay, map]);

	return (
		<>
			{locations
				.filter((location) => location.latitude && location.longitude)
				.map((location, index) => (
					<CustomMarker
						key={index}
						position={{ lat: location.latitude!, lng: location.longitude! }}
						label={`${location.number}`}
					/>
				))}
		</>
	);
};

export default DayLocationsMap;