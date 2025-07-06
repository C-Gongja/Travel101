'use client';

import React, { useState, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPersonalInfo } from '@/api/account/personalInfo/PerosnalInfoApi';

import { useUserStore } from '@/store/user/user-store';
import { PersonalInfoStore } from '@/store/user/user-personal-info-store'; // Zustand 스토어 임포트

import { useGetAllCountries } from '@/hooks/shared/countries/useGetAllCountries';

import { CountryResponse } from '@/types/trip/tripStoreTypes';
import { UserPersonalInfo } from '@/types/user/userPersonalInfoTypes';

import Button from '@/components/ui/buttons/Button';
import UserSnippetCard from '@/components/ui/card/UserSnippetCard';

interface PersonalInfoEditFieldProps {
	fieldKey: string; // 'name', 'username', 'email', 'bio' 등 필드 ID
	currentValue: string | undefined;
	onSaveSuccess: () => void; // 저장 성공 후 부모의 편집 모드를 끄는 콜백
	inputType?: 'text' | 'email' | 'textarea' | 'select'; // 입력 필드 타입 지정
	// 향후 유효성 검사 규칙을 전달할 수 있습니다.
	// validationRules?: (value: string) => string | null;
}

const PersonalInfoEditField: React.FC<PersonalInfoEditFieldProps> = ({
	fieldKey,
	currentValue,
	onSaveSuccess,
	inputType = 'text',
}) => {
	const queryClient = useQueryClient();
	const { updateField } = PersonalInfoStore(); // Zustand store action to update local state
	const { user } = useUserStore(); // Get user for UUID

	const [localValue, setLocalValue] = useState<string>(currentValue || '');
	const [error, setError] = useState<string | null>(null);

	const updateFieldMutation = useMutation({
		mutationFn: async (newValue: string) => {
			if (!user?.uuid) {
				throw new Error("User UUID not available for update.");
			}
			const patch = { [fieldKey]: newValue };
			return patchPersonalInfo(patch, user.uuid);
		},
		onMutate: async (newValue) => {
			if (!user?.uuid) return;

			queryClient.cancelQueries({ queryKey: ['personal-Info', user.uuid] });
			const previousPersonalInfo = PersonalInfoStore.getState().personalInfo;
			updateField(fieldKey as keyof UserPersonalInfo, newValue);

			const profileQueryKey = ['profile', user.uuid];
			await queryClient.cancelQueries({ queryKey: profileQueryKey });
			const previousProfile = queryClient.getQueryData(profileQueryKey);

			queryClient.setQueryData(profileQueryKey, (oldData: any) => {
				// oldData가 null 또는 undefined일 수 있으므로 nullish coalescing 사용
				if (!oldData) return oldData; // 데이터가 없으면 업데이트하지 않습니다.

				// 예시: profile 객체에 name, email, bio 등이 최상위에 바로 있는 경우
				return {
					...oldData,
					userSnippet: {
						...(oldData.userSnippet || {}),
						[fieldKey]: newValue,
					},
				};
			});

			return { previousPersonalInfo, previousProfile }; // onError 시 롤백을 위한 컨텍스트 반환
		},
		onSuccess: (data, variables, context) => {
			console.log(`${fieldKey} updated successfully.`);
			if (user?.uuid) {
				queryClient.invalidateQueries({ queryKey: ['personal-Info', user.uuid] });
			}
			// updateField(fieldKey, newValue);
			onSaveSuccess(); // 부모 컴포넌트의 편집 모드 끄기
			setError(null);
		},
		onError: (err: any, newValue, context) => {
			console.error(`Failed to update ${fieldKey}:`, err);
			setError(`Failed to update ${fieldKey}.`);
			// Rollback optimistic update
			if (context?.previousPersonalInfo) {
				PersonalInfoStore.getState().setPersonalInfo(context.previousPersonalInfo);
			}
			if (context?.previousProfile) {
				queryClient.setQueryData(['profile', user?.uuid], context.previousProfile);
			}
		},
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setLocalValue(e.target.value);
		setError(null); // Clear error on change
	};

	const handleSave = () => {
		// 여기에 유효성 검사 로직을 추가할 수 있습니다.
		// if (validationRules) {
		//   const validationError = validationRules(localValue);
		//   if (validationError) {
		//     setError(validationError);
		//     return;
		//   }
		// }

		// Basic validation example
		if (inputType === 'email' && localValue && !/\S+@\S+\.\S+/.test(localValue)) {
			setError('Please enter a valid email address.');
			return;
		}
		// Add more specific validation rules here if needed

		if (localValue !== currentValue) { // Only save if value has changed
			updateFieldMutation.mutate(localValue);
		} else {
			onSaveSuccess(); // If no change, just close edit mode
		}
	};

	const renderInput = () => {
		switch (inputType) {
			case 'textarea':
				return (
					<textarea
						className="input py-2 px-2 border rounded-lg w-full resize-y min-h-[80px]"
						value={localValue}
						onChange={handleChange}
						disabled={updateFieldMutation.isPending}
						rows={6} // Default rows for textarea
					/>
				);
			case 'select':
				const { data: countries, isLoading: isLoadingCountries } = useGetAllCountries();

				if (isLoadingCountries) {
					return <p>Loading countries...</p>;
				}

				return (
					<select
						className="input py-2 px-2 border rounded-lg w-full"
						value={localValue}
						onChange={handleChange}
						disabled={updateFieldMutation.isPending}
					>
						<option value="">Select a country</option>
						{countries?.map((c: CountryResponse) => (
							<option key={c.iso2} value={c.name}>
								{c.name}
							</option>
						))}
					</select>
				);
			case 'text':
			case 'email':
			default:
				return (
					<input
						type={inputType}
						className="input py-2 px-2 border rounded-lg w-full"
						value={localValue}
						onChange={handleChange}
						disabled={updateFieldMutation.isPending}
					/>
				);
		}
	};

	return (
		<div className="ml-4 mb-4"> {/* Added margin-left to align with labels */}
			{renderInput()}
			<div className="flex items-center justify-end mt-2 space-x-2 gap-3">
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
				<Button
					onClick={handleSave}
					text={updateFieldMutation.isPending ? 'Saving...' : 'Save'}
					padding="5px 15px"
					disabled={updateFieldMutation.isPending}
				/>
			</div>
		</div>
	);
};

export default PersonalInfoEditField;
