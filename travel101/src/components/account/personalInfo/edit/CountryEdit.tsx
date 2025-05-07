import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import Button from "@/components/ui/buttons/Button";
import { useGetAllCountries } from "@/hooks/shared/useGetAllCountries";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import { CountryResponse } from "@/types/trip/tripStoreTypes";
import { useState } from "react";

interface CountryEditProps {
	currentCountry: string;
	onSaveSuccess: () => void;
}

const CountryEdit = ({ currentCountry, onSaveSuccess }: CountryEditProps) => {
	const [country, setCountry] = useState(currentCountry);
	const { updateField } = PersonalInfoStore();
	const { data: countries, isLoading } = useGetAllCountries();

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
			{isLoading ? (
				<p>Loading countries...</p>
			) : (
				<select
					className="input py-2 px-2 border rounded-lg w-full"
					value={country}
					onChange={(e) => setCountry(e.target.value)}
				>
					<option value="">Select a country</option>
					{countries?.map((c: CountryResponse) => (
						<option key={c.iso2} value={c.name}>
							{c.name}
						</option>
					))}
				</select>
			)}
			<div className="my-4">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
}
export default CountryEdit;