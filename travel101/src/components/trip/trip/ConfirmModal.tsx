import { useState } from "react";

interface ConfirmModalProps {
	title: string;
	message: string; // 메시지 문자열
	onConfirm: () => void;
	onCancel?: () => void; // 취소 버튼이 없는 경우를 위해 선택적으로 변경
	confirmButtonText?: string;
	cancelButtonText?: string;
	confirmButtonColor?: string;
	error?: string | null; // 에러 메시지 여부
	isSuccess?: boolean; // 성공 상태를 나타내는 prop 추가
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	title,
	message,
	onConfirm,
	onCancel,
	confirmButtonText = 'Ok',
	cancelButtonText = 'Cancel',
	confirmButtonColor = 'bg-maincolor hover:bg-maindarkcolor', // 기본 색상은 파란색으로 변경
	error = null,
	isSuccess = false,
}) => {
	// 에러와 성공 상태를 기반으로 최종 상태 결정
	const isErrorState = !!error;
	const isSuccessState = !isErrorState && isSuccess; // 에러가 없고 isSuccess가 true일 때만 성공 상태

	// 모달 내부 컨테이너의 동적인 스타일
	const modalInnerClasses = `
    max-w-[600px] min-w-[400px] text-center p-4
    transform transition-all duration-300 ease-out
    ${isSuccessState ? 'scale-105' : 'scale-100'}
  `;

	// 제목의 동적인 스타일
	const titleClasses = `
    text-2xl font-bold mb-4
    ${isSuccessState ? 'text-maincolor' : isErrorState ? 'text-red-600' : 'text-gray-800'}
  `;

	// 메시지의 동적인 스타일 (여기서는 크게 변동 없음)
	const messageClasses = `
    text-lg mb-8 leading-relaxed
    ${isSuccessState ? 'text-gray-700' : isErrorState ? 'text-gray-700' : 'text-gray-600'}
  `;

	// 확인 버튼의 동적인 스타일
	const confirmButtonClasses = `
    w-full py-2 rounded-lg text-white font-semibold
    ${isSuccessState ? 'bg-maincolor hover:bg-maindarkcolor' : confirmButtonColor}
  `;

	// 취소 버튼의 동적인 스타일
	const cancelButtonClasses = `
    px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-all duration-200
  `;

	return (
		// 이 div는 Modal 컴포넌트의 children으로 들어갈 것이므로, 직접 fixed 포지셔닝이나 오버레이를 담당하지 않습니다.
		// 하지만 사진처럼 모달 자체의 크기/스타일은 여기서 제어합니다.
		<div className={modalInnerClasses}>
			{/* 성공/실패 아이콘 렌더링 */}
			<div className="flex justify-center items-center mb-4">
				{isSuccessState && (
					<svg className="w-20 h-20 text-maincolor" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				)}
				{isErrorState && !isSuccessState && ( // 에러 상태일 때만 X 아이콘
					<svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				)}
			</div>

			<h2 className={titleClasses}>{title}</h2>
			<p className={messageClasses}>{message}</p>

			<div className="flex justify-center gap-4">
				{/* 성공/실패 모달에서는 보통 확인(Ok/Close) 버튼 하나만 존재합니다. */}
				{/* 요청하신 이미지 스타일을 보면 에러든 성공이든 버튼이 하나입니다. */}
				<button
					onClick={onConfirm}
					className={confirmButtonClasses}
				>
					{confirmButtonText}
				</button>
			</div>
		</div>
	);
};

export default ConfirmModal;