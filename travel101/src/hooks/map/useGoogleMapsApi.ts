// src/hooks/useGoogleMapsApi.ts

import { useState, useMemo, useCallback } from 'react';
import { locationUtils } from '@/util/googleMapsutils';
import { SelectedLocation } from '@/types/trip/tripStoreTypes';

interface MapLocation {
	lat: number;
	lng: number;
}

export const useGoogleMapsApi = (map: google.maps.Map | null) => {
	const [markerPosition, setMarkerPosition] = useState<MapLocation | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<SelectedLocation | null>(null);

	const placesService = useMemo(() => (map ? new google.maps.places.PlacesService(map) : null), [map]);
	const geocoder = useMemo(() => new google.maps.Geocoder(), []);

	const updateLocation = useCallback((place: google.maps.places.PlaceResult | null, location: MapLocation) => {
		if (!place || !place.name || !place.formatted_address || !place.place_id) return;

		const countryIso2 = locationUtils.getCountryFromAddressComponents(place.address_components);

		setSelectedPlace({
			name: place.name,
			address: place.formatted_address,
			place_id: place.place_id,
			latitude: location.lat,
			longitude: location.lng,
			countryIso2,
		});
		setMarkerPosition(location);
		map?.panTo(location);
		map?.setZoom(16);
	}, [map]);

	const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
		if (!event.latLng || !placesService) return;
		const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };

		const geocodeResult = await locationUtils.geocodeLocation(geocoder, location);
		if (geocodeResult?.place_id) {
			const placeDetails = await locationUtils.getPlaceDetails(placesService, geocodeResult.place_id);
			updateLocation(placeDetails, location);
		}
	}, [placesService, geocoder, updateLocation]);

	const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult) => {
		if (place.geometry?.location) {
			const location = {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
			};
			updateLocation(place, location);
		}
	}, [updateLocation]);

	return {
		markerPosition,
		selectedPlace,
		placesService,
		handleMapClick,
		handlePlaceSelect,
		clearSelectedPlace: () => setSelectedPlace(null),
	};
};