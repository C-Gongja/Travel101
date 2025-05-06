import React from 'react';

interface SocialLink {
	platform: string;
	url: string;
}

interface SocialLinksDisplayProps {
	socialLinks: SocialLink[] | undefined;
}

const SocialLinksDisplay: React.FC<SocialLinksDisplayProps> = ({ socialLinks }) => {
	if (!socialLinks || socialLinks.length === 0) {
		return <div className="ml-4 text-gray-500">No social links added</div>;
	}

	return (
		<div className="flex flex-col justify-between">
			{socialLinks.map((link, index) => (
				<div key={index} className="ml-4 flex gap-20 mb-2 items-center text-gray-500">
					<span className="w-14">{link.platform}</span>
					<span className="break-all">{link.url}</span>
				</div>
			))}
		</div>
	);
};

export default SocialLinksDisplay;