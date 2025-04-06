/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
'use client'

import { useTripStore } from "@/app/store/createTrip/trip-store";
//Map component Component from library
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CustomMarker from "./customMarker";
import Modal from "@/components/ui/modals/mainModal";
import SelectedPlaceInfo from "./selectedPlaceInfo";
import AddLocationModal from "./addLocationModal";
import DayLocationsMap from "./dayLocationsMap";

//Map's styling
const defaultMapContainerStyle = {
	width: '100%',
	height: '650px',
	borderRadius: '15px 15px 15px 15px',
};

//K2's coordinates
const defaultMapCenter = {
	lat: 37.7749, lng: -122.4194,
}

//Default zoom level, can be adjusted
const defaultMapZoom = 18

//Map options
const defaultMapOptions = {
	zoomControl: true,
	tilt: 0,
	gestureHandling: 'auto',
	mapTypeId: 'roadmap',
	streetViewControl: false,
};

const MapComponent = () => {

	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<any>(null);
	const [isInfoVisible, setIsInfoVisible] = useState(false); // 정보창 표시 여부
	const [isModalOpen, setIsModalOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

	const { trip, searchQuery, selectedDay, setLocation } = useTripStore();

	// selectedDay 변경 시 지도 줌 조절
	useEffect(() => {
		if (map && trip) {
			const currentDay = trip.days.find((day) => day.number === selectedDay);
			const locations = currentDay?.locations || [];
			if (locations.length > 0) {
				const bounds = new google.maps.LatLngBounds();
				locations.forEach((location) => {
					if (location.latitude && location.longitude) {
						bounds.extend({ lat: location.latitude, lng: location.longitude });
					}
				});

				// bounds가 비어 있지 않으면 지도 조정
				if (!bounds.isEmpty()) {
					map.fitBounds(bounds, 80); // padding으로 여백 추가
					console.log("selected day3: ", selectedDay);
				}
			} else if (locations.length === 0) {
				// locations가 없으면 기본 중심으로 리셋
				map.setCenter(defaultMapCenter);
				map.setZoom(defaultMapZoom);
			}
		}
	}, [map, trip, selectedDay]);

	// 🔍 searchQuery가 변경될 때 검색 실행
	useEffect(() => {
		if (searchQuery != "" && searchQuery && inputRef.current && searchBoxRef.current) {
			inputRef.current.value = searchQuery; // 입력 필드에 searchQuery 반영

			// Google Places API를 통해 검색 실행
			const service = new google.maps.places.PlacesService(map || new google.maps.Map(document.createElement('div')));
			service.textSearch(
				{
					query: searchQuery,
					location: defaultMapCenter, // 기본 중심 좌표 사용 (필요 시 동적으로 변경 가능)
					radius: 5000, // 검색 반경 (단위: 미터)
				},
				(results, status) => {
					if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
						const place = results[0];
						const location = {
							lat: place.geometry?.location?.lat() || 0,
							lng: place.geometry?.location?.lng() || 0,
						};
						setSelectedPlace({
							name: place.name,
							address: place.formatted_address,
							place_id: place.place_id,
						});
						setMarkerPosition(location);
						map?.panTo(location);
						map?.setZoom(16);
						setIsInfoVisible(true);
						setLocation({
							name: place.name,
							latitude: location.lat,
							longitude: location.lng,
						});
					} else {
						console.error("Search failed:", status);
					}
				}
			);
		}
	}, [searchQuery, map]);

	// 🔍 검색 결과 선택 시 실행
	const onPlacesChanged = () => {
		if (searchBoxRef.current) {
			const places = searchBoxRef.current.getPlaces();
			if (places && places.length > 0) {
				const place = places[0];
				const location = {
					lat: place.geometry?.location?.lat() || 0,
					lng: place.geometry?.location?.lng() || 0,
				};
				setLocation(
					{
						name: place.name,
						latitude: place.geometry?.location?.lat() || 0,
						longitude: place.geometry?.location?.lng() || 0,
					}
				)
				setSelectedPlace({
					name: place.name,
					address: place.formatted_address,
					place_id: place.place_id,
				});
				setMarkerPosition(location); // 📍 마커 업데이트
				map?.panTo(location); // 🗺️ 지도 이동
				map?.setZoom(16);
				setIsInfoVisible(true);
			}
		}
	};

	const onMapClick = async (event: google.maps.MapMouseEvent) => {
		if (!event.latLng) return;

		const location = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng(),
		};
		setMarkerPosition(location);

		// 📌 Geocoder API 호출
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode({ location }, async (results, status) => {
			if (status === "OK" && results?.length) {
				const placeInfo = results[0];

				// `place_id`가 있으면 Places API로 추가 정보 요청
				if (placeInfo.place_id) {
					const placeDetails = await getPlaceDetails(placeInfo.place_id);
					setSelectedPlace({
						name: placeDetails?.name || placeInfo.formatted_address, // 상호명 or 주소 저장
						address: placeInfo.formatted_address,
						place_id: placeInfo.place_id,
					});
					setLocation({
						name: placeDetails?.name,
						latitude: placeDetails?.geometry?.location?.lat() || 0,
						longitude: placeDetails?.geometry?.location?.lng() || 0,
					})
					setIsInfoVisible(true);
				}
			} else {
				console.error("Geocoder failed due to:", status);
			}
		});
	};

	// 📌 Google Places API에서 place_id로 장소 정보 가져오기
	const getPlaceDetails = async (placeId: string) => {
		const service = new google.maps.places.PlacesService(map!);
		return new Promise<google.maps.places.PlaceResult | null>((resolve) => {
			service.getDetails({ placeId }, (place, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					resolve(place);
				} else {
					console.error("Places API failed due to:", status);
					resolve(null);
				}
			});
		});
	};

	return (
		<div className="relative w-full">
			{/* 🔍 지도 내부 검색창 */}
			<div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
				<StandaloneSearchBox
					onLoad={(searchBox) => (searchBoxRef.current = searchBox)}
					onPlacesChanged={onPlacesChanged}>
					<input
						ref={inputRef}
						type="text"
						placeholder="Search places..."
						className="py-2 px-6 w-[150%] border rounded-full shadow-md"
					/>
				</StandaloneSearchBox>
			</div>

			{/* 🗺️ Google Map */}
			<GoogleMap
				options={defaultMapOptions}
				mapContainerStyle={defaultMapContainerStyle}
				center={defaultMapCenter}
				zoom={defaultMapZoom}
				onLoad={(map) => setMap(map)}
				onClick={onMapClick} // 🏆 지도 클릭 이벤트 추가
			>
				{/* 📍 검색 or 클릭한 위치에 마커 표시 */}
				{markerPosition && (
					<CustomMarker
						position={markerPosition}
						label={`!`}
						onClick={() => alert("마커 클릭됨!")}
					/>
				)}

				{/* show added locations (day) on the map */}
				<DayLocationsMap />

				{/* 📌 선택된 장소 정보 컴포넌트 */}
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