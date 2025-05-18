'use client'

import { useTripStore } from "@/store/trip/trip-store";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { useEffect, useRef, useState, useMemo } from "react";
import CustomMarker from "./customMarker";
import Modal from "@/components/ui/modal/MainModal";
import AddLocationModal from "./addLocationModal";
import DayLocationsMap from "./dayLocationsMap";
import SelectedPlaceInfo from "./\bselectedPlaceInfo";
import { SelectedLocation } from "@/types/trip/tripStoreTypes";

interface MapLocation {
	lat: number;
	lng: number;
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
	getPlaceDetails: (service: google.maps.places.PlacesService, placeId: string) =>
		new Promise<google.maps.places.PlaceResult | null>((resolve) => {
			service.getDetails({ placeId }, (place, status) => {
				resolve(status === google.maps.places.PlacesServiceStatus.OK ? place : null);
			});
		}),

	searchPlaces: (service: google.maps.places.PlacesService, query: string, center: MapLocation) =>
		new Promise<google.maps.places.PlaceResult | null>((resolve) => {
			service.textSearch(
				{ query, location: center, radius: 5000 },
				(results, status) => {
					resolve(status === google.maps.places.PlacesServiceStatus.OK && results?.length
						? results[0]
						: null);
				}
			);
		}),

	geocodeLocation: (geocoder: google.maps.Geocoder, location: MapLocation) =>
		new Promise<google.maps.GeocoderResult | null>((resolve) => {
			geocoder.geocode({ location }, (results, status) => {
				resolve(status === "OK" && results?.length ? results[0] : null);
			});
		}),

	// 주소 구성 요소에서 국가 추출
	getCountryFromAddressComponents: (components?: google.maps.GeocoderAddressComponent[]) => {
		return components?.find((component) =>
			component.types.includes("country")
		)?.short_name || "";
	}
};

const MapComponent = () => {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [markerPosition, setMarkerPosition] = useState<MapLocation | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<SelectedLocation | null>(null);
	const [isInfoVisible, setIsInfoVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
	const { trip, searchQuery, selectedDay, setLocation } = useTripStore();

	// Places Service 인스턴스 메모이제이션
	const placesService = useMemo(() =>
		map ? new google.maps.places.PlacesService(map) : null,
		[map]
	);

	const geocoder = useMemo(() => new google.maps.Geocoder(), []);

	// 위치 업데이트 헬퍼 함수
	const updateLocation = (place: google.maps.places.PlaceResult | null, location: MapLocation) => {
		if (!place) return;

		const country = locationUtils.getCountryFromAddressComponents(place.address_components);
		console.log("country: ", country);

		setSelectedPlace({
			name: place.name,
			address: place.formatted_address,
			place_id: place.place_id,
			country: country,
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

	// 검색 쿼리 처리
	useEffect(() => {
		if (!searchQuery || !placesService || !inputRef.current) return;

		inputRef.current.value = searchQuery;
		locationUtils.searchPlaces(placesService, searchQuery, MAP_CONFIG.defaultCenter)
			.then((place) => {
				if (place?.geometry?.location) {
					const location = {
						lat: place.geometry.location.lat(),
						lng: place.geometry.location.lng(),
					};
					updateLocation(place, location);
				}
			})
			.catch((error) => console.error("Search failed:", error));
	}, [searchQuery, placesService]);

	const handlePlacesChanged = () => {
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

		const result = await locationUtils.geocodeLocation(geocoder, location);
		if (result?.place_id) {
			const details = await locationUtils.getPlaceDetails(placesService, result.place_id);
			updateLocation(details, location);
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
				<AddLocationModal
					selectedPlace={selectedPlace}
					onClose={() => setIsModalOpen(false)}
				/>
			</Modal>
		</div>
	);
};

export { MapComponent };