// src/components/map/MapController.tsx

'use client';
import { useEffect, useState } from 'react';
import { useTripStore } from '@/store/trip/trip-store';

import { MAP_CONFIG } from '@/constants/mapConstants';
import { useGoogleMapsApi } from '@/hooks/map/useGoogleMapsApi';
import { locationUtils } from '@/util/googleMapsutils';

import GoogleMapWrapper from './GoogleMapWrapper';
import PlaceSearchBox from './PlaceSearchBox';
import CustomMarker from './customMarker';
import DayLocationsMap from './dayLocationsMap';
import Modal from '@/components/ui/modal/MainModal';
import AddLocationModal from './addLocationModal';
import SelectedPlaceInfo from './\bselectedPlaceInfo';

const MapController = () => {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [isInfoVisible, setIsInfoVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { trip, searchQuery, selectedDay } = useTripStore();
	const {
		markerPosition,
		selectedPlace,
		placesService,
		handleMapClick,
		handlePlaceSelect,
		clearSelectedPlace,
	} = useGoogleMapsApi(map);

	// Effect to handle search queries from the global store
	useEffect(() => {
		if (searchQuery && placesService) {
			locationUtils.searchPlaces(placesService, searchQuery, MAP_CONFIG.defaultCenter)
				.then(place => place && handlePlaceSelect(place))
				.catch(error => console.error("Search failed:", error));
		}
	}, [searchQuery, placesService, handlePlaceSelect]);

	// Effect to adjust map bounds to show locations for the selected day
	useEffect(() => {
		if (!map || !trip) return;
		const currentDay = trip.days.find(day => day.number === selectedDay);
		const locations = currentDay?.locations || [];

		if (locations.length > 0) {
			const bounds = new google.maps.LatLngBounds();
			locations.forEach(loc => {
				if (loc.latitude && loc.longitude) {
					bounds.extend({ lat: loc.latitude, lng: loc.longitude });
				}
			});
			if (!bounds.isEmpty()) map.fitBounds(bounds, 80);
		}
	}, [map, trip, selectedDay]);

	// Effect to control the visibility of the info window
	useEffect(() => {
		setIsInfoVisible(!!selectedPlace);
	}, [selectedPlace]);

	const handleCloseInfo = () => {
		clearSelectedPlace();
		setIsInfoVisible(false);
	};

	const handleSaveClick = () => {
		setIsInfoVisible(false);
		setIsModalOpen(true);
	};

	return (
		<div className="relative w-full">
			<PlaceSearchBox onPlaceSelect={handlePlaceSelect} />

			<GoogleMapWrapper onLoad={setMap} onClick={handleMapClick}>
				{markerPosition && <CustomMarker position={markerPosition} />}

				<DayLocationsMap />

				{isInfoVisible && selectedPlace && (
					<SelectedPlaceInfo
						selectedPlace={selectedPlace}
						onClose={handleCloseInfo}
						onSaveClick={handleSaveClick}
					/>
				)}
			</GoogleMapWrapper>

			{selectedPlace && (
				<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
					<AddLocationModal
						selectedPlace={selectedPlace}
						onClose={() => setIsModalOpen(false)}
					/>
				</Modal>
			)}
		</div>
	);
};

export default MapController;