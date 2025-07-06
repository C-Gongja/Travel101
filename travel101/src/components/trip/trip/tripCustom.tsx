"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { updateDaysOrder, updateLocationsOrder } from "@/util/TripDragDropUtil";

import { useUserStore } from "@/store/user/user-store";
import { useTripStore } from "@/store/trip/trip-store";

import useDeleteTrip from "@/hooks/trip/useDeleteTrip";
import useScriptTrip from "@/hooks/trip/useScriptTrip";
import useConfirmModal from "@/hooks/shared/tripConfirmModal/useConfirmModal";

import Modal from "@/components/ui/modal/MainModal";
import LikesButton from "@/components/ui/buttons/like/LikesButton";

import DateComponent from "./dateComponent";
import DayComponent from "./day/dayComponent";
import ConfirmModal from "./buttons/ConfirmModal";

import { FaClone } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useAuthModalStore } from "@/store/user/useAuthModalStore";

export default function TripCustom() {
	const router = useRouter();
	const pathname = usePathname();
	const { user, isAuthenticated } = useUserStore();
	const { setAfterAuthCallback, onOpen } = useAuthModalStore();
	const { trip, isOwner, setTripName, addDay, setTrip } = useTripStore();

	const { scriptTrip, isSaving: isCloning } = useScriptTrip();
	const { deleteTrip, isLoading: isDeleting } = useDeleteTrip();

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

	const [value, setValue] = useState(trip?.name || "");
	const [inputWidth, setInputWidth] = useState(10);
	const [isLiked, setIsLiked] = useState(trip?.isLiked);
	const spanRef = useRef<HTMLSpanElement>(null);
	console.log(pathname);
	// useEffect(() => {
	// 	console.log("trip: ", trip);
	// }, [trip]);

	useEffect(() => {
		if (spanRef.current) {
			const width = spanRef.current.offsetWidth;
			setInputWidth(width + 20); // padding 조금 추가
		}
	}, [value]);

	const handleTripNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isOwner) return;
		setTripName(e.target.value);
	};

	// --- 모달을 띄우는 핸들러들 (이제 useConfirmModal 사용) ---
	const handleScriptClick = () => {
		if (!user || !trip) {
			setAfterAuthCallback(() => {
				router.push(pathname);
			});
			onOpen();
			return;
		}
		openConfirmModal(
			'script',
			async () => {
				await scriptTrip(trip.tripUid);
			},
			undefined, // 초기 메시지는 훅에서 정의된 기본값 사용
			trip.name // 트립 이름 전달
		);
	};

	const handleDeleteClick = () => {
		if (!isOwner || !trip) {
			openConfirmModal(
				'custom',
				async () => { },
				"You don't have permission to delete this trip.",
				trip?.name
			);
			return;
		}
		openConfirmModal(
			'delete',
			async () => {
				await deleteTrip();
			},
			undefined, // 초기 메시지는 훅에서 정의된 기본값 사용
			trip.name // 트립 이름 전달
		);
	};

	const onDragEnd = (result: any) => {
		const { source, destination, type } = result;
		if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
			return;
		}

		if (!trip || !isOwner) {
			console.error("Trip is null, cannot proceed with drag and drop.");
			return;
		}

		let updatedTrip = { ...trip };

		if (type === "day") {
			updatedTrip.days = updateDaysOrder(trip.days, source.index, destination.index);
		} else if (type === "location") {
			const sourceDayIndex = parseInt(source.droppableId, 10);
			const destDayIndex = parseInt(destination.droppableId, 10);

			if (sourceDayIndex === destDayIndex) {
				updatedTrip.days = updateLocationsOrder(trip.days, sourceDayIndex, source.index, destination.index);
			} else {
				let sourceDay = { ...trip.days[sourceDayIndex] };
				let destDay = { ...trip.days[destDayIndex] };

				const [movedLocation] = sourceDay.locations.splice(source.index, 1);
				destDay.locations.splice(destination.index, 0, movedLocation);

				sourceDay.locations = sourceDay.locations.map((loc, index) => ({
					...loc,
					number: index + 1,
				}));

				destDay.locations = destDay.locations.map((loc, index) => ({
					...loc,
					number: index + 1,
				}));

				updatedTrip.days[sourceDayIndex] = sourceDay;
				updatedTrip.days[destDayIndex] = destDay;
			}
		}
		setTrip(updatedTrip);
	};

	// if (isSaving || isDeleting || isCloning) {
	// 	return (
	// 		<div className="flex justify-center items-center h-screen text-xl text-gray-700">
	// 			{isDeleting ? "여행을 삭제 중입니다..." : "여행 정보를 저장 중입니다..."}
	// 		</div>
	// 	);
	// }

	return (
		<div className="px-6 h-[calc(100vh-500px)]">
			<div className="flex justify-between items-center">
				<div className="flex items-center flex-row gap-2">
					<input
						onChange={(e) => {
							setValue(e.target.value);
							handleTripNameChange(e);
						}}
						placeholder="Trip Name"
						value={trip?.name || ""}
						disabled={!isOwner}
						maxLength={20}
						style={{ width: `${inputWidth}px` }}
						className="text-4xl font-bold p-2 input-style outline-none"
					/>
					<span
						className="absolute invisible whitespace-pre pointer-events-none overflow-hidden"
						style={{
							height: 0,
							whiteSpace: "pre",
							visibility: "hidden",
							position: "absolute",
							padding: "0 8px",
							fontSize: "2.25rem",
							fontWeight: "bold",
							fontFamily: "inherit",
						}}
						ref={spanRef}
					>
						{value || " "}
					</span>

					<div className="flex items-center gap-5">
						<div className='flex gap-2'>
							<div className="flex items-center gap-2 text-2xl">
								{(trip) &&
									<LikesButton targetType={"TRIP"} targetUid={trip?.tripUid} isLiked={isLiked} setIsLiked={setIsLiked} />
								}
							</div>
							<p className="text-lg">{trip?.likesCount || 0}</p>
						</div>
						<div className='flex gap-2'>
							<div className="flex items-center gap-2 text-xl">
								<button
									onClick={handleScriptClick}
									className="text-gray-500 hover:text-maincolor transition duration-200"
									aria-label="Clone trip"
								>
									<FaClone />
								</button>
							</div>
							<p className="text-lg">{trip?.scriptedCount || 0}</p>
						</div>
					</div>
				</div>
				{isOwner && (
					<button
						onClick={handleDeleteClick}
						className="w-8 h-8 text-red-500 rounded-full flex items-center justify-center hover:text-white hover:bg-red-500 transition duration-200"
						aria-label="Delete trip"
					>
						<MdDeleteOutline size={25} />
					</button>
				)}
			</div>

			<div className="flex items-center justify-between mt-2 text-lg text-gray-500">
				<DateComponent />
				{trip?.completed ? "Explored" : "Unexplored"}
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="days" type="day">
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
							{trip?.days.map((day, dayIndex) => (
								<DayComponent key={`day-${dayIndex}`} day={day} dayIndex={dayIndex} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			{isOwner && (
				<div className="mt-4 gap-4">
					<button
						onClick={addDay}
						className="px-4 py-2 rounded-lg flex items-center gap-2 text-xl text-maincolor hover:bg-maincolor hover:text-white transition duration-200"
					>
						<IoIosAddCircle className="text-2xl" />
						Day
					</button>
				</div>
			)}

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