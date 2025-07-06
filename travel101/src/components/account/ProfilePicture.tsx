import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";

interface ProfilePictureProps {
	pictureUrl: string | undefined; // The URL of the current profile picture
	onSaveSuccess?: () => void; // Callback to refresh personal info after successful upload
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ pictureUrl, onSaveSuccess }) => {
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// State for the image displayed: either the newly selected preview, or the current one
	const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(pictureUrl);

	// Keep displayImageUrl in sync with currentPictureUrl if the prop changes
	useEffect(() => {
		setDisplayImageUrl(pictureUrl);
	}, [pictureUrl]);

	// Mutation for uploading the profile picture
	const updatePictureMutation = useMutation({
		mutationFn: async (file: File) => {
			// ⭐ IMPORTANT: This is where you'll call your actual backend API.
			// Typically, you'd use FormData to send the file.
			const formData = new FormData();
			formData.append('profilePicture', file); // 'profilePicture' should match your backend's expected field name

			// Replace with your actual API call. Example using a placeholder:
			// const response = await updateProfilePictureApi(formData);
			// return response.data;

			// Placeholder for testing: Simulate an API call with a delay
			console.log('Simulating profile picture upload for file:', file.name);
			return new Promise((resolve) => setTimeout(() => resolve({ newUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=New+Pic' }), 1500));
		},
		onSuccess: (data: any) => {
			console.log('Profile picture uploaded successfully!', data);
			// Invalidate the personalInfo query to refetch the latest data (which includes the new picture URL)
			queryClient.invalidateQueries(['profile']);

			// Optionally, if your backend returns the new URL, you can update the Zustand store directly
			// setPersonalInfo((prev: any) => ({ ...prev, picture: data.newUrl })); 

			onSaveSuccess(); // Call the parent's success callback (e.g., to close a modal or show a message)
		},
		onError: (error) => {
			console.error('Failed to upload profile picture:', error);
			alert('Failed to upload profile picture. Please try again.');
			// If upload fails, revert to the original picture URL
			setDisplayImageUrl(pictureUrl);
		},
	});

	// Function to open the hidden file input dialog
	const handleEditClick = () => {
		fileInputRef.current?.click();
	};

	// Handler for when a file is selected
	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			// Create a URL for immediate preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setDisplayImageUrl(reader.result as string); // Set the preview URL
			};
			reader.readAsDataURL(file); // Read the file as a Data URL

			// Trigger the mutation to upload the file to the backend
			updatePictureMutation.mutate(file);
		} else {
			// If file selection is cancelled, revert to the original picture URL
			setDisplayImageUrl(pictureUrl);
		}
	};

	return (
		<div className="w-28 h-28 mr-4 relative group rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
			{/* Profile Image */}
			<Image
				src={displayImageUrl || '/img/logo-color.png'} // Use preview URL, then current, then default
				alt="User profile picture"
				className="object-cover w-full h-full"
				width={120}
				height={120}
				onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
					e.currentTarget.src = '/img/logo-color.png'; // Fallback to default on error
				}}
				loading="lazy"
			/>


			{/* Hidden File Input */}
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/*" // Only allow image files
				className="hidden"
			/>

			{/* Edit Overlay */}
			<div
				className={`absolute inset-0 flex items-center justify-center 
                   bg-black bg-opacity-60 rounded-full cursor-pointer
                   transition-opacity duration-300
                   ${updatePictureMutation.isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
				onClick={handleEditClick}
				title="Change profile picture"
			>
				{updatePictureMutation.isPending ? (
					<span className="text-white text-xs sm:text-sm">Uploading...</span>
				) : (
					<span className="text-white text-xs sm:text-sm font-semibold">EDIT</span>
				)}
			</div>
		</div>
	);
};

export default ProfilePicture;