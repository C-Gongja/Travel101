interface MapLocation {
	lat: number;
	lng: number;
}

// Extracts the country's ISO code from address components
const getCountryFromAddressComponents = (components?: google.maps.GeocoderAddressComponent[]) => {
	return components?.find((component) => component.types.includes("country"))?.short_name || "";
};

// Fetches details for a specific Place ID
const getPlaceDetails = (service: google.maps.places.PlacesService, placeId: string) =>
	new Promise<google.maps.places.PlaceResult | null>((resolve) => {
		service.getDetails({ placeId }, (place, status) => {
			resolve(status === google.maps.places.PlacesServiceStatus.OK ? place : null);
		});
	});

// Searches for a place based on a query string
const searchPlaces = (service: google.maps.places.PlacesService, query: string, center: MapLocation) =>
	new Promise<google.maps.places.PlaceResult | null>((resolve) => {
		service.textSearch(
			{ query, location: center, radius: 5000 },
			(results, status) => {
				resolve(status === google.maps.places.PlacesServiceStatus.OK && results?.length ? results[0] : null);
			}
		);
	});

// Geocodes a latitude/longitude coordinate to find address details
const geocodeLocation = (geocoder: google.maps.Geocoder, location: MapLocation) =>
	new Promise<google.maps.GeocoderResult | null>((resolve) => {
		geocoder.geocode({ location }, (results, status) => {
			resolve(status === "OK" && results?.length ? results[0] : null);
		});
	});

export const locationUtils = {
	getCountryFromAddressComponents,
	getPlaceDetails,
	searchPlaces,
	geocodeLocation,
};