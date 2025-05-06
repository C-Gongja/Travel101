'use client'

import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import * as jsonpatch from 'fast-json-patch';
import { useUserStore } from "@/store/user/user-store";
import { patchPersonalInfo } from "@/api/account/personalInfo/PerosnalInfoApi";
import { Operation } from "fast-json-patch";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";

interface NameEditProps {
	currentName: string;
	onSaveSuccess: () => void;
}

const NameEdit = ({ currentName, onSaveSuccess }: NameEditProps) => {
	const [name, setName] = useState(currentName);
	const { updateField } = PersonalInfoStore();

	const handleSave = async () => {
		const { user } = useUserStore.getState();
		const patch = { name: name };
		if (user?.uid) {
			await patchPersonalInfo(patch, user?.uid);
		}
		updateField('name', name);
		onSaveSuccess();
	};

	return (
		<>
			<input
				className="input py-2 px-2 border rounded-lg"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<div className="my-4">
				<Button onClick={handleSave} text="Save" padding="10px 20px" />
			</div>
		</>
	);
};

export default NameEdit;