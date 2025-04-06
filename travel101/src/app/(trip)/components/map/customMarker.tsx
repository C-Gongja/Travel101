import { Marker } from "@react-google-maps/api";

interface CustomMarkerProps {
	position: google.maps.LatLngLiteral;
	label?: string; // 마커 위에 표시할 라벨
	onClick?: () => void; // 클릭 이벤트
}

const CustomMarker = ({ position, label, onClick }: CustomMarkerProps) => {
	return (
		<Marker
			position={position}
			label={label ? { text: label, color: "white", fontSize: "18px" } : undefined}
			icon={{
				path: google.maps.SymbolPath.CIRCLE,
				scale: 15,
				fillColor: "#646cff",
				fillOpacity: 1.0,
				strokeWeight: 2,
				strokeOpacity: 0.8,
				strokeColor: "white",
			}}
			onClick={onClick}
		/>
	);
};

export default CustomMarker;
