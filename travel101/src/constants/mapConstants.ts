export const MAP_CONFIG = {
	containerStyle: {
		width: '100%',
		height: '650px',
		borderRadius: '15px',
	},
	// use user's location.
	defaultCenter: { lat: 37.7749, lng: -122.4194 },
	defaultZoom: 18,
	options: {
		zoomControl: true,
		tilt: 0,
		gestureHandling: 'auto',
		mapTypeId: 'roadmap',
		streetViewControl: false,
	},
} as const;