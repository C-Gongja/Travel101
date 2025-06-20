'use client';

import { useEffect, useState } from "react";
import { useTripStore } from "@/store/trip/trip-store";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import { UserSnippet } from "@/types/user/userSnippetTypes";
import { CommentSection } from "@/components/comment/CommentSection";
import { MapProvider } from "@/components/trip/map/MapProvider";

import UserSnippetCard from "@/components/ui/card/UserSnippetCard";
import MapController from "@/components/trip/map/MapController";
import TripCustom from "@/components/trip/trip/tripCustom";
import useConfirmModal from "@/hooks/shared/tripConfirmModal/useConfirmModal";
import Modal from "@/components/ui/modal/MainModal";
import ConfirmModal from "@/components/trip/trip/buttons/ConfirmModal";
import useSaveTrip from "@/hooks/trip/useSaveTrip";

export default function TripCreatePage() {
	const { tripUid } = useParams<{ tripUid: string }>();
	const { trip, initializeNewTrip, resetTripStore } = useTripStore();
	const { user, isAuthenticated, isUserLoading } = useUserStore();
	const [userSnippet, setUserSnippet] = useState<UserSnippet>();

	const [isPageInitialized, setIsPageInitialized] = useState(false);
	const targetType = 'TRIP';

	const { saveTrip, isSaving } = useSaveTrip();

	const {
		showConfirmModal,
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

	useEffect(() => {
		console.log("trip: ", trip);
		console.log("isPageInitialized: ", isPageInitialized);
		console.log("isUserLoading: ", isUserLoading);
	}, [trip, isUserLoading, isPageInitialized]);

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// 지금 문제가 trip에 trip이 있는 상태에서 여기 들어오면 isPageInitialized 가 false로 되어서 trip이 reset이 안되고 안뜨는 문제가있다.
	useEffect(() => {
		// 페이지 로드 시 새로운 여행 초기화 (최초 한 번만)
		if (!isPageInitialized && !trip) { // trip이 null일 때만 초기화
			initializeNewTrip();
			setIsPageInitialized(true);
		}
		return () => {
			// router.pathname을 확인할 수 있다면 특정 경로 이탈 시에만 resetTripStore 호출
			// resetTripStore();
		};
	}, [trip, resetTripStore]);

	// handleSave 함수: 이제 첫 저장 시에는 tripUid가 없으므로 이를 고려해야 합니다.
	const handleSave = async () => {
		if (!trip) {
			openConfirmModal(
				'custom',
				async () => { },
				"Trip data is not initialized.",
				"New Trip"
			);
			return;
		}

		openConfirmModal(
			'save',
			async () => {
				await saveTrip(trip); // savedTrip은 실제 tripUid를 포함
			},
			'Do you want to save your new trip?',
			trip.name || "New Trip"
		);
	};

	// 로딩 상태 (사용자 로딩, trip 스토어 초기화, 저장 중)
	// 지금 처음에 create trip btn을 누르면 잘 뜨는데 뒤로 갔다가 다시 누르면 isPageInitiatlized 가 false가 안도ㅓㅣ는듯.
	if (isUserLoading || !isPageInitialized || !trip) {
		return <div>Loading trip creation page...</div>;
	}

	// 저장 중 로딩 스피너
	if (isSaving) {
		return (
			<div className="flex justify-center items-center h-screen text-xl text-gray-700">
				Saving...
			</div>
		);
	}

	return (
		<div className="flex flex-col px-4">
			<h1 className="text-4xl font-bold mb-10"></h1>
			<div className="grid grid-cols-2 gap-4 w-full h-auto mb-8">
				{/* Map section */}
				<MapProvider>
					<MapController />
				</MapProvider>

				{/* Trip section (스크롤 가능) */}
				<div className="bg-white p-4 rounded-lg overflow-y-auto no-scrollbar">
					<TripCustom />
				</div>
			</div>
			{isAuthenticated && (
				<button
					onClick={handleSave}
					className="mb-8 px-4 py-2 text-xl text-white border border-maincolor bg-maincolor rounded-md 
					hover:bg-white hover:text-maincolor transition duration-200"
				>
					Save
				</button>
			)}
			{/* how to show default Account info card */}
			{/* <div className="mb-5">
				{userSnippet && (<UserSnippetCard userSnippet={userSnippet} toggleFollow={toggleFollow} />)}
			</div> */}
			<div className="border-b-2"></div>
			{/* how to show default comments */}
			<div className="">
				<CommentSection targetType={targetType} targetUid={tripUid} />
			</div>

			{/* Save 전용 ConfirmModal */}
			<Modal isOpen={showConfirmModal} onClose={closeConfirmModal}>
				<ConfirmModal
					title={modalTitle}
					message={modalMessage}
					onConfirm={handleConfirmAction}
					onCancel={closeConfirmModal}
					confirmButtonText={confirmButtonText}
					confirmButtonColor={confirmButtonColor}
					error={modalError}
					isSuccess={isModalSuccess}
				/>
			</Modal>
		</div>
	);
}