import TripCustom from "../components/trip/tripCustom";

export default function BuildTripPage() {

	return (
		<div className="flex justify-center items-center flex-col min-h-screen p-4">
			<h1 className="text-4xl font-bold mb-4">Build Your Own Trip!</h1>
			<div className="grid grid-cols-2 gap-4 w-full h-[calc(100vh-200px)]">
				{/* Map section */}
				<div className="bg-gray-200 p-4 rounded-lg">
					<h1 className="text-xl font-semibold">Map</h1>
					{/* 여기에 지도 컴포넌트 추가 가능 */}
				</div>

				{/* Trip section (스크롤 가능) */}
				<div className="bg-white p-4 rounded-lg overflow-y-auto">
					<TripCustom />
				</div>
			</div>
		</div>
	);
}