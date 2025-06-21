'use client';

import { useEffect, useState } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { fetchGetTrip } from "@/api/trip/tripApi";
import { MapProvider } from "../../../../components/trip/map/MapProvider";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user/user-store";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { CommentSection } from "@/components/comment/CommentSection";
import { DotsSpinner } from "@/components/ui/spinner/DotsSpinner";
import useConfirmModal from "@/hooks/shared/tripConfirmModal/useConfirmModal";
import useSaveTrip from "@/hooks/trip/useSaveTrip";
import TripCustom from "../../../../components/trip/trip/tripCustom";
import UserSnippetCard from "@/components/ui/card/UserSnippetCard";
import MapController from "@/components/trip/map/MapController";
import Modal from "@/components/ui/modal/MainModal";
import ConfirmModal from "@/components/trip/trip/buttons/ConfirmModal";

export default function TripPage() {
	const { tripUid } = useParams<{ tripUid: string }>();
	const { trip, isOwner, setTrip, setIsOwner } = useTripStore();
	const { user, isAuthenticated, isUserLoading } = useUserStore();
	const [isInitializing, setIsInitializing] = useState(true);
	const [userSnippet, setUserSnippet] = useState<UserSnippet>();
	const targetType = 'TRIP';
	const queryClient = useQueryClient();

	const { saveTrip, isSaving, error: saveError } = useSaveTrip();

	const {
		showConfirmModal, // 이름이 겹치므로 TripPage용으로 변경
		modalTitle,
		modalMessage,
		confirmButtonText,
		confirmButtonColor,
		modalError,
		isModalSuccess,
		openConfirmModal,
		closeConfirmModal,
		handleConfirmAction,
	} = useConfirmModal();

	const { data: tripData, isLoading } = useQuery({
		queryKey: ['trip', tripUid],
		queryFn: () => fetchGetTrip({ tripUid: tripUid, isAuthenticated, user }),
		initialData: () => queryClient.getQueryData(['trip', tripUid]), // Home에서 캐싱된 데이터 사용
		staleTime: 1 * 60 * 1000, // 1분 동안 캐시 유지
		enabled: isAuthenticated !== null, // user 상태가 로드된 후에만 실행
	});

	useEffect(() => {
		if (tripData && isInitializing) {
			setTrip({
				...tripData.trip,
				startDate: new Date(tripData.trip.startDate),
				endDate: new Date(tripData.trip.endDate),
			});
			setIsOwner(tripData.editable);
			setUserSnippet(tripData.userSnippet);
			setIsInitializing(false);
		}
	}, [tripData, isInitializing, setTrip, setIsOwner]);

	const toggleFollow = (uuid: string, isFollowing: boolean) => {
		setUserSnippet(prev =>
			prev?.uuid == uuid ? { ...prev, isFollowing } : prev
		);
	};

	const handleSave = async () => {
		if (!isOwner || !trip) {
			openConfirmModal(
				'custom',
				async () => { }, // 실행할 액션은 없으므로 빈 함수
				"You don't have permission to save this trip.",
				trip?.name
			);
			return;
		}

		openConfirmModal(
			'save', // 'save' 액션 타입
			async () => { // 실제 saveTrip 로직을 콜백으로 전달
				await saveTrip(trip);
			},
			undefined,
			trip.name // 트립 이름 전달
		);
	};

	if (isUserLoading || isLoading || isInitializing || !trip) {
		return (
			<div className="flex items-center justify-center min-h-[80vh]">
				<DotsSpinner />
			</div>
		);
	}

	return (
		<div className="flex flex-col px-4">
			<h1 className="text-4xl font-bold mb-10"></h1>
			<div className="grid grid-cols-2 gap-4 w-full h-auto mb-8">
				{/* Map section */}
				<div className="">
					{isLoading ?
						<div></div>
						:
						(
							<MapProvider>
								<MapController />
							</MapProvider>
						)
					}
				</div>

				{/* Trip section (스크롤 가능) */}
				<div className="bg-white p-4 rounded-lg overflow-y-auto no-scrollbar">
					<TripCustom />
				</div>
			</div>

			{isOwner && (
				<button
					onClick={handleSave}
					className="mb-8 py-3 text-xl text-white border border-maincolor bg-maincolor rounded-md 
					hover:bg-white hover:text-maincolor transition duration-200"
				>
					Save
				</button>
			)}

			{/* Account info card */}
			<div className="mb-5">
				{userSnippet && (<UserSnippetCard userSnippet={userSnippet} toggleFollow={toggleFollow} />)}
			</div>
			<div className="border-b-2"></div>
			{/* comments */}
			<div className="">
				<CommentSection targetType={targetType} targetUid={tripUid} />
			</div>

			{/* TripPage의 Save 전용 ConfirmModal */}
			<Modal isOpen={showConfirmModal} onClose={closeConfirmModal}>
				<ConfirmModal
					title={modalTitle}
					message={modalMessage}
					onConfirm={handleConfirmAction} // useConfirmModal의 handleConfirmAction 연결
					onCancel={closeConfirmModal} // useConfirmModal의 closeConfirmModal 연결
					confirmButtonText={confirmButtonText}
					confirmButtonColor={confirmButtonColor}
					error={modalError}
					isSuccess={isModalSuccess}
				/>
			</Modal>
		</div>
	);
}