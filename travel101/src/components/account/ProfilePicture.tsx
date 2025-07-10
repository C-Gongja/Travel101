import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import CheckmarkAnimation from "../ui/animation/CheckmarkAnimation";
import { useUploadProfilePic } from "@/hooks/profile/useUploadProfilePic";
import { useParams } from "next/navigation";

interface ProfilePictureProps {
	pictureUrl: string | undefined; // The URL of the current profile picture
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ pictureUrl }) => {
	const { user } = useUserStore();
	const { uuid } = useParams<{ uuid: string }>();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		handleFileChange,
		isUploading,
		showCheck,
	} = useUploadProfilePic();

	// Function to open the hidden file input dialog
	const handleEditClick = () => {
		fileInputRef.current?.click();
	};

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		handleFileChange(file);
	};

	return (
		<div className="w-28 h-28 mr-4 relative group rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
			{/* Profile Image */}
			<Image
				src={pictureUrl || '/img/logo-color.png'} // Use preview URL, then current, then default
				alt="User profile picture"
				className="object-cover w-full h-full pointer-events-none"
				width={120}
				height={120}
				onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
					e.currentTarget.src = '/img/logo-color.png'; // Fallback to default on error
				}}
				loading="lazy"
			/>
			{user?.uuid === uuid && (
				<>
					{/* Hidden File Input */}
					<input
						type="file"
						ref={fileInputRef}
						onChange={onFileChange}
						accept="image/*"
						className="hidden"
					/>

					{/* Edit Overlay */}
					<div
						className={`absolute inset-0 flex items-center justify-center 
                bg-black bg-opacity-60 rounded-full cursor-pointer
                transition-opacity duration-300
                ${isUploading || showCheck ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
						onClick={handleEditClick}
						title="Change profile picture"
					>
						{isUploading ? (
							<span className="text-white text-xs sm:text-sm">Uploading...</span>
						) : showCheck ? (
							<CheckmarkAnimation />
						) : (
							<span className="text-white text-xs sm:text-base font-semibold">edit</span>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ProfilePicture;