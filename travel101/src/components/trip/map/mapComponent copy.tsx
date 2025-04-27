'use client'

import { useTripStore } from "@/store/trip/trip-store";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { useEffect, useRef, useState, useMemo } from "react";
import CustomMarker from "./customMarker";
import Modal from "@/components/ui/modals/MainModal";
import SelectedPlaceInfo from "./selectedPlaceInfo";
import AddLocationModal from "./addLocationModal";
import DayLocationsMap from "./dayLocationsMap";

// 타입 정의
interface MapLocation {
	lat: number;
	lng: number;
}

interface PlaceInfo {
	name?: string;
	address?: string;
	place_id?: string;
	country?: string;
}

// 상수 정의
const MAP_CONFIG = {
	containerStyle: {
		width: '100%',
		height: '650px',
		borderRadius: '15px 15px 15px 15px',
	},
	defaultCenter: { lat: 37.7749, lng: -122.4194 },
	defaultZoom: 18,
	options: {
		zoomControl: true,
		tilt: 0,
		gestureHandling: 'auto',
		mapTypeId: 'roadmap',
		streetViewControl: false,
	}
} as const;

// 위치 처리 유틸리티
const locationUtils = {
	getPlaceDetails: (service: google.maps.places.PlacesService, placeId: string, cache: Map<string, google.maps.places.PlaceResult>) =>
		new Promise<google.maps.places.PlaceResult | null>((resolve) => {
			if (cache.has(placeId)) {
				resolve(cache.get(placeId)!);
				return;
			}
			service.getDetails({ placeId }, (place, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK && place) {
					cache.set(placeId, place);
					resolve(place);
				} else {
					resolve(null);
				}
			});
		}),

	geocodeLocation: (geocoder: google.maps.Geocoder, location: MapLocation, cache: Map<string, google.maps.GeocoderResult>) => {
		const cacheKey = `${location.lat},${location.lng}`;
		return new Promise<google.maps.GeocoderResult | null>((resolve) => {
			if (cache.has(cacheKey)) {
				resolve(cache.get(cacheKey)!);
				return;
			}
			geocoder.geocode({ location }, (results, status) => {
				if (status === "OK" && results?.length) {
					cache.set(cacheKey, results[0]);
					resolve(results[0]);
				} else {
					resolve(null);
				}
			});
		});
	},

	getCountryFromAddressComponents: (components?: google.maps.GeocoderAddressComponent[]) => {
		return components?.find((component) => component.types.includes("country"))?.long_name || "";
	}
};

const MapComponent = () => {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [markerPosition, setMarkerPosition] = useState<MapLocation | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
	const [isInfoVisible, setIsInfoVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
	const { trip, searchQuery, selectedDay, setLocation } = useTripStore();

	// 캐시 추가
	const placeCache = useMemo(() => new Map<string, google.maps.places.PlaceResult>(), []);
	const geocodeCache = useMemo(() => new Map<string, google.maps.GeocoderResult>(), []);

	const placesService = useMemo(() => map ? new google.maps.places.PlacesService(map) : null, [map]);
	const geocoder = useMemo(() => new google.maps.Geocoder(), []);

	// 위치 업데이트 헬퍼 함수
	const updateLocation = (place: google.maps.places.PlaceResult | null, location: MapLocation) => {
		if (!place) return;

		const country = locationUtils.getCountryFromAddressComponents(place.address_components);

		setSelectedPlace({
			name: place.name,
			address: place.formatted_address,
			place_id: place.place_id,
			country,
		});
		setMarkerPosition(location);
		setLocation({
			name: place.name || '',
			latitude: location.lat,
			longitude: location.lng,
		});
		map?.panTo(location);
		map?.setZoom(16);
		setIsInfoVisible(true);
	};

	// 지도 bounds 조정
	useEffect(() => {
		if (!map || !trip) return;

		const currentDay = trip.days.find((day) => day.number === selectedDay);
		const locations = currentDay?.locations || [];

		if (locations.length > 0) {
			const bounds = new google.maps.LatLngBounds();
			locations.forEach((loc) => {
				if (loc.latitude && loc.longitude) {
					bounds.extend({ lat: loc.latitude, lng: loc.longitude });
				}
			});
			if (!bounds.isEmpty()) {
				map.fitBounds(bounds, 80);
			}
		} else {
			map.setCenter(MAP_CONFIG.defaultCenter);
			map.setZoom(MAP_CONFIG.defaultZoom);
		}
	}, [map, trip, selectedDay]);

	// 검색 처리 (StandaloneSearchBox로 통합, searchQuery 제거)
	const handlePlacesChanged = async () => {
		const places = searchBoxRef.current?.getPlaces();
		if (places?.length && places[0].geometry?.location) {
			const place = places[0];
			const location = {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
			};
			updateLocation(place, location);
		}
	};

	const handleMapClick = async (event: google.maps.MapMouseEvent) => {
		if (!event.latLng || !placesService) return;

		const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
		setMarkerPosition(location);

		// Geocoding은 필수 정보가 아닌 경우 생략 가능
		const result = await locationUtils.geocodeLocation(geocoder, location, geocodeCache);
		if (result?.place_id) {
			const details = await locationUtils.getPlaceDetails(placesService, result.place_id, placeCache);
			updateLocation(details || result, location); // details가 없으면 geocode 결과 사용
		} else {
			// 최소 정보로 업데이트
			setSelectedPlace({ address: result?.formatted_address || "Unknown location" });
			setIsInfoVisible(true);
		}
	};

	return (
		<div className="relative w-full">
			<div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
				<StandaloneSearchBox
					onLoad={(searchBox) => (searchBoxRef.current = searchBox)}
					onPlacesChanged={handlePlacesChanged}
				>
					<input
						ref={inputRef}
						type="text"
						placeholder="Search places..."
						className="py-2 px-6 w-[150%] border rounded-full shadow-md"
					/>
				</StandaloneSearchBox>
			</div>

			<GoogleMap
				options={MAP_CONFIG.options}
				mapContainerStyle={MAP_CONFIG.containerStyle}
				center={MAP_CONFIG.defaultCenter}
				zoom={MAP_CONFIG.defaultZoom}
				onLoad={setMap}
				onClick={handleMapClick}
			>
				{markerPosition && (
					<CustomMarker
						position={markerPosition}
						label="!"
						onClick={() => alert("마커 클릭됨!")}
					/>
				)}
				<DayLocationsMap />
				{isInfoVisible && selectedPlace && (
					<SelectedPlaceInfo
						selectedPlace={selectedPlace}
						onClose={() => setIsInfoVisible(false)}
						onSaveClick={() => setIsModalOpen(true)}
					/>
				)}
			</GoogleMap>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<AddLocationModal onClose={() => setIsModalOpen(false)} />
			</Modal>
		</div>
	);
};

export { MapComponent };