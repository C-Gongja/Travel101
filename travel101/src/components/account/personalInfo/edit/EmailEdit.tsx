import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import Button from "@/components/ui/buttons/Button";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import { useState } from "react";

interface EmailEditProps {
	currentEmail: string;
	onSaveSuccess: () => void;
}

const EmailEdit = ({ currentEmail, onSaveSuccess }: EmailEditProps) => {
	const [email, setEmail] = useState(currentEmail);
	const { updateField } = PersonalInfoStore();

	const handleSave = async () => {
		const { user } = useUserStore.getState();
		const patch = { email: email };
		onSaveSuccess();
	};

	return (
		<>
			<input
				type="email"
				className="input py-2 px-2 border rounded-lg"
				value={currentEmail}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<div className="mt-4">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
}
export default EmailEdit;