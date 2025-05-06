import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import Button from "@/components/ui/buttons/Button";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useUserStore } from "@/store/user/user-store";
import { Operation } from "fast-json-patch";
import { useState } from "react";

interface UsernameEditProps {
	currentUsername: string;
	onSaveSuccess: () => void;
}

const UsernameEdit = ({ currentUsername, onSaveSuccess }: UsernameEditProps) => {
	const [username, setUsername] = useState(currentUsername);
	const { updateField } = PersonalInfoStore();

	const handleSave = async () => {
		const { user } = useUserStore.getState();
		const patch = { username: username };
		if (user?.uid) {
			await patchPersonalInfo(patch, user?.uid);
		}
		updateField('username', username);
		onSaveSuccess();
	};

	return (
		<>
			<input
				className="input py-2 px-2 border rounded-lg"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<div className="my-4">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
}
export default UsernameEdit;