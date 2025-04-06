
interface SelectedPlaceInfoProps {
	selectedPlace: { name: string; address: string; place_id: string };
	onClose: () => void; // 정보창 닫기
	onSaveClick: () => void; // Save 버튼 클릭 시 호출
}

const SelectedPlaceInfo: React.FC<SelectedPlaceInfoProps> = ({ selectedPlace, onClose, onSaveClick }) => {
	return (
		<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] bg-white p-4 border shadow-md rounded-lg transition duration-200">
			{/* 닫기 버튼 */}
			<button
				onClick={onClose}
				className="absolute top-1 right-4 text-gray-600 hover:text-black text-xl"
			>
				✖️
			</button>

			<h2 className="text-lg font-bold text-gray-950 text-center">{selectedPlace?.name}</h2>
			<p className="text-gray-600 text-center">{selectedPlace?.address}</p>
			<div className="flex justify-end mt-2 gap-2">
				<button
					className="py-2 px-4 rounded-full border border-maincolor hover:bg-maincolor hover:text-white"
				>
					Favorite
				</button>
				<button
					onClick={onSaveClick}
					className="py-2 px-4 rounded-full border border-maincolor hover:bg-maincolor hover:text-white"
				>
					Save
				</button>
			</div>
		</div>
	);
}

export default SelectedPlaceInfo;