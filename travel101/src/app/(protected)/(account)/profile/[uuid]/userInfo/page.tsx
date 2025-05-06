'use client'

import ProfileField from "@/components/account/personalInfo/display/ProfileField";
import SocialLinksDisplay from "@/components/account/personalInfo/display/SocialLinksDisplay";
import BioEdit from "@/components/account/personalInfo/edit/BioEdit";
import CountryEdit from "@/components/account/personalInfo/edit/CountryEdit";
import EmailEdit from "@/components/account/personalInfo/edit/EmailEdit";
import NameEdit from "@/components/account/personalInfo/edit/NameEdit";
import SocialLinksEdit from "@/components/account/personalInfo/edit/SocialLinksEdit";
import UsernameEdit from "@/components/account/personalInfo/edit/UsernameEdit";
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
}[] = [
		{
			id: 'name',
			label: 'Name',
			getEditComponent: (info, onSaveSuccess) => <NameEdit currentName={info?.name} onSaveSuccess={onSaveSuccess} />,
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.name || "No name provided"}</span>
		},
		{
			id: 'username',
			label: 'Username',
			getEditComponent: (info, onSaveSuccess) => <UsernameEdit currentUsername={info?.username} onSaveSuccess={onSaveSuccess} />,
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.username || "No username provided"}</span>
		},
		{
			id: 'email',
			label: 'Email',
			getEditComponent: (info, onSaveSuccess) => <EmailEdit currentEmail={info?.email} onSaveSuccess={onSaveSuccess} />,
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.email || "No country provided"}</span>
		},
		{
			id: 'country',
			label: 'Country',
			getEditComponent: (info, onSaveSuccess) => <CountryEdit currentCountry={info?.country} onSaveSuccess={onSaveSuccess} />,
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.country || "No country provided"}</span>
		},
		{
			id: 'bio',
			label: 'Bio',
			getEditComponent: (info, onSaveSuccess) => <BioEdit currentBio={info?.bio} onSaveSuccess={onSaveSuccess} />,
			displayValue: (info) => <span className="ml-4 mb-4 flex justify-between items-center text-gray-500">{info?.bio || "No bio provided"}</span>
		},
		{
			id: 'socialLinks',
			label: 'Social Links',
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