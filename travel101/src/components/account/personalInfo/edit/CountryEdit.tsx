import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import Button from "@/components/ui/buttons/Button";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import { useState } from "react";

interface CountryEditProps {
	currentCountry: string;
	onSaveSuccess: () => void;
}

const CountryEdit = ({ currentCountry, onSaveSuccess }: CountryEditProps) => {
	const [country, setCoutnry] = useState(currentCountry);
	const { updateField } = PersonalInfoStore();

	const handleSave = async () => {
		const { user } = useUserStore.getState();
		const patch = { country: country };
		if (user?.uid) {
			await patchPersonalInfo(patch, user?.uid);
		}
		updateField('country', country);
		onSaveSuccess();
	};

	return (
		<>
			<input
				className="input py-2 px-2 border rounded-lg"
				value={currentCountry}
				onChange={(e) => setCoutnry(e.target.value)}
			/>
			<div className="mt-4">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
}
export default CountryEdit;