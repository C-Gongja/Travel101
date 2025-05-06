import React from 'react';

interface ProfileFieldProps {
	label: string;
	isEditing: boolean;
	onToggleEdit: () => void;
	editComponent: React.ReactNode;
	customDisplay?: React.ReactNode;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
	label,
	isEditing,
	onToggleEdit,
	editComponent,
	customDisplay
}) => {
	return (
		<div>
			<div className="flex justify-between">
				<label className="block text-lg font-medium mb-1">{label}</label>
				<button
					type="button"
					onClick={onToggleEdit}
					className="text-sm text-gray-500"
				>
					{isEditing ? "Cancel" : "Edit"}
				</button>
			</div>

			{isEditing ? (
				editComponent
			) : (
				customDisplay
			)}
		</div>
	);
};

export default ProfileField;