// src/components/map/PlaceSearchBox.tsx

'use client';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useRef } from 'react';

interface PlaceSearchBoxProps {
	onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

const PlaceSearchBox = ({ onPlaceSelect }: PlaceSearchBoxProps) => {
	const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

	const handlePlacesChanged = () => {
		const places = searchBoxRef.current?.getPlaces();
		if (places && places.length > 0) {
			onPlaceSelect(places[0]);
		}
	};

	return (
		<div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 w-2/5 max-w-md">
			<StandaloneSearchBox
				onLoad={(ref) => (searchBoxRef.current = ref)}
				onPlacesChanged={handlePlacesChanged}
			>
				<input
					type="text"
					placeholder="Search places..."
					className="py-2 px-6 w-full border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</StandaloneSearchBox>
		</div>
	);
};

export default PlaceSearchBox;