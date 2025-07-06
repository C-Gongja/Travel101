'use client'

import ProfileField from "@/components/account/personalInfo/display/ProfileField";
import SocialLinksDisplay from "@/components/account/personalInfo/display/SocialLinksDisplay";
import PersonalInfoEditField from "@/components/account/personalInfo/edit/PersonalInfoEdit";
import SocialLinksEdit from "@/components/account/personalInfo/edit/SocialLinksEdit";
import { useGetPersonalInfo } from "@/hooks/profile/personalInfo/useGetPersonalInfo";
import { PersonalInfoStore } from "@/store/user/user-personal-info-store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 필드 설정을 위한 타입 정의
type FieldKey = 'name' | 'username' | 'email' | 'country' | 'bio' | 'socialLinks';

// 필드 설정 객체를 미리 정의
const PROFILE_FIELDS: {
	id: FieldKey;
	label: string;
	getEditComponent: (personalInfo: any, onSaveSuccess: () => void) => React.ReactNode;
	displayValue?: (personalInfo: any) => React.ReactNode;
	inputType?: 'text' | 'email' | 'textarea' | 'select'; // Added inputType
}[] = [
		{
			id: 'name',
			label: 'Name',
			inputType: 'text', // Specify input type
			getEditComponent: (info, onSaveSuccess) => (
				<PersonalInfoEditField
					fieldKey="name"
					currentValue={info?.name}
					onSaveSuccess={onSaveSuccess}
					inputType="text"
				/>
			),
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.name || "No name provided"}</span>
		},
		{
			id: 'username',
			label: 'Username',
			inputType: 'text', // Specify input type
			getEditComponent: (info, onSaveSuccess) => (
				<PersonalInfoEditField
					fieldKey="username"
					currentValue={info?.username}
					onSaveSuccess={onSaveSuccess}
					inputType="text"
				/>
			),
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.username || "No username provided"}</span>
		},
		{
			id: 'email',
			label: 'Email',
			inputType: 'email', // Specify input type
			getEditComponent: (info, onSaveSuccess) => (
				<PersonalInfoEditField
					fieldKey="email"
					currentValue={info?.email}
					onSaveSuccess={onSaveSuccess}
					inputType="email"
				/>
			),
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.email || "No email provided"}</span>
		},
		{
			id: 'country',
			label: 'Country',
			inputType: 'select', // Specify input type as select
			getEditComponent: (info, onSaveSuccess) => (
				<PersonalInfoEditField
					fieldKey="country"
					currentValue={info?.country}
					onSaveSuccess={onSaveSuccess}
					inputType="select" // Use 'select' for countries
				/>
			),
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.country || "No country provided"}</span>
		},
		{
			id: 'bio',
			label: 'Bio',
			inputType: 'textarea', // Specify input type as textarea
			getEditComponent: (info, onSaveSuccess) => (
				<PersonalInfoEditField
					fieldKey="bio"
					currentValue={info?.bio}
					onSaveSuccess={onSaveSuccess}
					inputType="textarea" // Use 'textarea' for bio
				/>
			),
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.bio || "No bio provided"}</span>
		},
		{
			id: 'socialLinks',
			label: 'Social Links',
			// Social links are more complex, so we keep their dedicated edit component
			getEditComponent: (info, onSaveSuccess) => <SocialLinksEdit socialLinks={info?.socialLinks} onSaveSuccess={onSaveSuccess} />,
			displayValue: (info) => <SocialLinksDisplay socialLinks={info?.socialLinks} />
		}
	];

const PersonalInfo = () => {
	const { uuid } = useParams<{ uuid: string }>();
	const { data, isLoading } = useGetPersonalInfo(uuid);
	const { personalInfo, setPersonalInfo } = PersonalInfoStore();

	useEffect(() => {
		if (data) {
			setPersonalInfo(data); // zustand에 초기값 세팅
		}
	}, [data]);

	// 편집 상태를 관리하는 단일 객체
	const [editingFields, setEditingFields] = useState<Record<FieldKey, boolean>>({
		name: false,
		username: false,
		email: false,
		country: false,
		bio: false,
		socialLinks: false,
	});

	// 편집 상태를 토글하는 함수
	const toggleEdit = (field: FieldKey) => {
		setEditingFields(prev => ({ ...prev, [field]: !prev[field] }));
	};

	if (isLoading) {
		return <div className="max-w-3xl mx-auto p-6">Loading personal information...</div>;
	}

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="mb-10">Personal Info</h1>
			<div className="space-y-6">
				{PROFILE_FIELDS.map((field, index) => (
					<div key={field.id}>
						<ProfileField
							label={field.label}
							isEditing={editingFields[field.id]}
							onToggleEdit={() => toggleEdit(field.id)}
							editComponent={field.getEditComponent(personalInfo, () => toggleEdit(field.id))}
							customDisplay={field.displayValue && field.displayValue(personalInfo)}
						/>
						{index < PROFILE_FIELDS.length - 1 && <div className="border" />}
					</div>
				))}
			</div>
		</div>
	);
};

export default PersonalInfo;