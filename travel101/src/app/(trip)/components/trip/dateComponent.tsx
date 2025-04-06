'use client';

import { useTripStore } from '@/app/store/createTrip/trip-store';
import { useState, useEffect } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

export default function DateComponent() {
	const { trip, isOwner, updateDates } = useTripStore();

	// 타입 수정: null 허용
	const [value, setValue] = useState<{
		startDate: Date | null;
		endDate: Date | null;
	}>({
		startDate: trip?.startDate ?? null,
		endDate: trip?.endDate ?? null,
	});

	useEffect(() => {
		console.log("Date trip:", trip);
	}, [trip]);

	// 날짜 변경 핸들러: 타입 수정 및 로직 개선
	const handleDateChange = (newValue: { startDate: string | Date | null; endDate: string | Date | null } | null) => {
		console.log("새로운 날짜 범위:", newValue);

		if (!newValue) {
			setValue({ startDate: null, endDate: null });
			return;
		}

		const startDate = newValue.startDate ? new Date(newValue.startDate) : null;
		const endDate = newValue.endDate ? new Date(newValue.endDate) : null;

		setValue({ startDate, endDate });

		if (startDate && endDate) {
			updateDates(startDate, endDate);
		}
	};

	// trip의 날짜가 변경될 때 상태 업데이트
	useEffect(() => {
		if (trip && (trip.startDate !== value.startDate || trip.endDate !== value.endDate)) {
			setValue({
				startDate: trip.startDate,
				endDate: trip.endDate,
			});
		}
	}, [trip?.startDate, trip?.endDate]);

	return (
		<Datepicker
			useRange={false}
			asSingle={false}
			readOnly={true}
			disabled={!isOwner}
			value={value}
			separator="-"
			onChange={handleDateChange}
			displayFormat="YYYY-MM-DD"
			primaryColor="indigo"
			containerClassName="relative w-[280px]"
			inputClassName="p-2 w-full cursor-pointer text-gray-500 focus:outline-none focus:border-0 focus:ring-0"
			toggleClassName=""
		/>
	);
}