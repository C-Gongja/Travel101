import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import Button from "@/components/ui/buttons/Button";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import { useState } from "react";

interface BioEditProps {
	currentBio: string;
	onSaveSuccess: () => void;
}

const BioEdit = ({ currentBio, onSaveSuccess }: BioEditProps) => {
	const [updatedBio, setUpdatedBio] = useState(currentBio);
	const { updateField } = PersonalInfoStore();

	const handleSave = async () => {
		const { user } = useUserStore.getState();
		const patch = { bio: updatedBio };
		console.log("updatedBio", patch);
		if (user?.uid) {
			await patchPersonalInfo(patch, user?.uid);
		}
		updateField('bio', updatedBio);
		onSaveSuccess();
	};

	return (
		<>
			<textarea
				className="input w-full py-2 px-2 border rounded-lg"
				rows={6}
				value={updatedBio}
				onChange={(e) => setUpdatedBio(e.target.value)}
			/>
			<div className="my-4">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
}
export default BioEdit;