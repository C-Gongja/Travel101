'use client'

import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import Button from "@/components/ui/buttons/Button";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import { SocialLink, SocialLinkDto } from "@/types/user/userPersonalInfoTypes";
import { useState } from "react";

interface SocialLinksEditProps {
	socialLinks: SocialLinkDto;
	onSaveSuccess: () => void;
}

const SocialLinksEdit: React.FC<SocialLinksEditProps> = ({ socialLinks, onSaveSuccess }) => {
	const [updatedSocialLinks, setUpdatedSocialLinks] = useState<SocialLinkDto>(socialLinks);
	const { updateField } = PersonalInfoStore();

	const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
		const updatedLinks = [...updatedSocialLinks.socialLinks];
		updatedLinks[index] = { ...updatedLinks[index], [field]: value };
		setUpdatedSocialLinks({ socialLinks: updatedLinks });
	};

	const handleAddSocialLink = () => {
		setUpdatedSocialLinks(prev => ({
			socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
		}));
	};

	const handleRemoveSocialLink = (index: number) => {
		setUpdatedSocialLinks(prev => ({
			socialLinks: prev.socialLinks.filter((_, i) => i !== index)
		}));
	};

	const handleSave = async () => {
		const { user } = useUserStore.getState();
		const patch = { socialLinks: updatedSocialLinks };
		console.log("currentSocialLinks", patch);
		if (user?.uid) {
			await patchPersonalInfo(patch, user?.uid);
		}
		updateField('socialLinks', updatedSocialLinks);
		onSaveSuccess();
	};

	return (
		<>
			{updatedSocialLinks.socialLinks.map((link, index) => (
				<div key={index} className="mb-4 ml-4">
					<div className="flex flex-col md:flex-row md:items-end md:gap-x-4">
						{/* Platform */}
						<div className="mb-2 md:mb-0">
							<label
								htmlFor={`platform-${index}`}
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Platform
							</label>
							<select
								id={`platform-${index}`}
								className="input w-32 p-2 border rounded-lg"
								value={link.platform}
								onChange={(e) =>
									handleSocialLinkChange(index, "platform", e.target.value)
								}
							>
								<option value="">Select</option>
								<option value="Instagram">Instagram</option>
								<option value="Facebook">Facebook</option>
								<option value="Youtube">Youtube</option>
								<option value="Twitter">Twitter</option>
							</select>
						</div>

						{/* URL */}
						<div className="flex-1 mb-2 md:mb-0">
							<label
								htmlFor={`url-${index}`}
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								URL
							</label>
							<input
								id={`url-${index}`}
								className="input w-full p-2 border rounded-lg"
								placeholder="URL"
								value={link.url}
								onChange={(e) =>
									handleSocialLinkChange(index, "url", e.target.value)
								}
							/>
						</div>

						{/* Remove Button */}
						<div>
							<button
								type="button"
								onClick={() => handleRemoveSocialLink(index)}
								className="p-2 text-red-500 text-sm"
							>
								Remove
							</button>
						</div>
					</div>
				</div>
			))}
			<button
				type="button"
				onClick={handleAddSocialLink}
				className="text-blue-500 mt-4 text-sm"
			>
				+ Add Social Link
			</button>
			<div className="mt-2">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
}
export default SocialLinksEdit;