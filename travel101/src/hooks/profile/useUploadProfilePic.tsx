import { uploadProfilePic } from "@/api/account/profile/profileApi";
import { useUserStore } from "@/store/user/user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface UploadPayload {
	uuid: string;
	file: File;
}

export function useUploadProfilePic() {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const [showCheck, setShowCheck] = useState(false);

	const mutation = useMutation({
		mutationFn: async ({ uuid, file }: UploadPayload) => { return await uploadProfilePic(uuid, file); },
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({ queryKey: ["profile", user?.uuid] });
			setShowCheck(true);
			setTimeout(() => setShowCheck(false), 2000);
		},
		onError: (err) => {
			alert("Failed to upload profile picture. Please try again.");
		},
	});

	const handleFileChange = (file?: File | null) => {
		if (!file) {
			alert("Please select a valid image file.");
			return;
		}

		if (!user?.uuid) {
			alert("You must be logged in to upload a profile picture.");
			return;
		}

		if (!file.type.startsWith("image/")) {
			alert("Only image files are allowed.");
			return;
		}

		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			alert("File size must be under 5MB.");
			return;
		}

		mutation.mutate(
			{ uuid: user.uuid, file },
			{
				onError: (error) => {
					console.error("Upload failed:", error);
					alert("Failed to upload profile picture. Please try again.");
				},
			}
		);
	};

	return {
		handleFileChange,
		isUploading: mutation.isPending,
		showCheck,
	};
}