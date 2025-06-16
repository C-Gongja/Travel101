import React from 'react';
import { FaClone } from 'react-icons/fa';

interface LocationHeaderProps {
	locationName: string;
	onCloneClick: () => void;
}

const LocationHeader: React.FC<LocationHeaderProps> = ({ locationName, onCloneClick }) => {
	return (
		<div className="flex gap-5 font-semibold">
			{locationName}
			<button
				onClick={onCloneClick}
				className="text-gray-500 hover:text-maincolor transition duration-200"
			>
				<FaClone className="text-lg" />
			</button>
		</div>
	);
};

export default LocationHeader;