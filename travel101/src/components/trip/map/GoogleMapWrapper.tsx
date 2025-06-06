'use client';
import { GoogleMap } from '@react-google-maps/api';
import { MAP_CONFIG } from '@/constants/mapConstants';
import React from 'react';

interface GoogleMapWrapperProps {
	onLoad: (map: google.maps.Map) => void;
	onClick: (event: google.maps.MapMouseEvent) => void;
	children: React.ReactNode;
}

const GoogleMapWrapper = ({ onLoad, onClick, children }: GoogleMapWrapperProps) => {
	return (
		<GoogleMap
			options={MAP_CONFIG.options}
			mapContainerStyle={MAP_CONFIG.containerStyle}
			center={MAP_CONFIG.defaultCenter}
			zoom={MAP_CONFIG.defaultZoom}
			onLoad={onLoad}
			onClick={onClick}
		>
			{children}
		</GoogleMap>
	);
};

export default GoogleMapWrapper;