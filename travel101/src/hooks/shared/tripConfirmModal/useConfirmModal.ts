// hooks/useConfirmModal.ts
import { useState, useCallback } from 'react';

// 모달 액션 타입을 좀 더 유연하게 정의할 수 있도록 확장
type ModalActionType = 'script' | 'delete' | 'save' | 'custom' | null;

interface UseConfirmModalReturn {
	showConfirmModal: boolean;
	modalTitle: string;
	modalMessage: string;
	confirmButtonText: string;
	confirmButtonColor: string;
	modalError: string | null;
	isModalSuccess: boolean;
	openConfirmModal: (
		actionType: ModalActionType,
		onConfirmCallback: () => Promise<void>,
		initialMessage?: string | null,
		tripName?: string // 트립 이름을 동적으로 전달받을 수 있도록 추가
	) => void;
	closeConfirmModal: () => void;
	handleConfirmAction: () => Promise<void>;
}

const useConfirmModal = (): UseConfirmModalReturn => {
	const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
	const [modalActionType, setModalActionType] = useState<ModalActionType>(null);
	const [currentOnConfirmCallback, setCurrentOnConfirmCallback] = useState<(() => Promise<void>) | null>(null);
	const [initialCustomMessage, setInitialCustomMessage] = useState<string | null>(null); // 초기 커스텀 메시지 (예: 저장 확인 메시지)
	const [modalError, setModalError] = useState<string | null>(null);
	const [isModalSuccess, setIsModalSuccess] = useState<boolean>(false);
	const [contextTripName, setContextTripName] = useState<string | undefined>(undefined); // 트립 이름 저장

	// 모달 내용 동적 생성 함수
	const getModalContent = useCallback(() => {
		// 1. 성공 상태일 때 (최우선)
		if (isModalSuccess) {
			return {
				title: 'Success!',
				message: `Successfully ${modalActionType} '${contextTripName}'`,
				confirmButtonText: 'Ok',
				confirmButtonColor: 'bg-green-500 hover:bg-green-600',
			};
		}

		// 2. 에러 상태일 때 (그 다음 우선순위)
		if (modalError) {
			return {
				title: 'Error!',
				message: modalError,
				confirmButtonText: 'Close',
				confirmButtonColor: 'bg-red-500 hover:bg-red-600',
			};
		}

		// 3. 초기 확인 메시지 (성공/에러 이전)
		if (initialCustomMessage) {
			return {
				title: contextTripName ? `Create '${contextTripName}'?` : 'Confirm Action',
				message: initialCustomMessage,
				confirmButtonText: 'Confirm', // 초기 커스텀 메시지일 때는 'Confirm'으로
				confirmButtonColor: 'bg-maincolor hover:bg-maindarkcolor', // 기본 색상으로
			};
		}

		// 4. 액션 타입에 따른 기본 메시지
		switch (modalActionType) {
			case 'script':
				return {
					title: contextTripName ? `Clone '${contextTripName}'` : 'Clone Trip',
					message: `Do you want to clone '${contextTripName}'?`,
					confirmButtonText: 'Clone',
					confirmButtonColor: 'bg-maincolor hover:bg-maindarkcolor',
				};
			case 'delete':
				return {
					title: contextTripName ? `Delete '${contextTripName}'` : 'Delete Trip',
					message: `Are you sure you want to delete '${contextTripName}'?`,
					confirmButtonText: 'Delete',
					confirmButtonColor: 'bg-red-500 hover:bg-red-600',
				};
			case 'save':
				return {
					title: contextTripName ? `Save Changes to '${contextTripName}'` : 'Save Changes',
					message: 'Do you want to save the changes?',
					confirmButtonText: 'Save',
					confirmButtonColor: 'bg-maincolor hover:bg-maindarkcolor',
				};
			default:
				return {
					title: 'Information',
					message: 'Please select an action.',
					confirmButtonText: 'OK',
					confirmButtonColor: 'bg-gray-500 hover:bg-gray-600',
				};
		}
	}, [isModalSuccess, modalError, initialCustomMessage, modalActionType, contextTripName]);


	// 모달을 여는 함수
	const openConfirmModal = useCallback((
		type: ModalActionType,
		confirmFn: () => Promise<void>,
		initialMsg: string | null = null,
		tripName: string | undefined = undefined
	) => {
		setModalActionType(type);
		setCurrentOnConfirmCallback(() => confirmFn); // 콜백 함수 저장
		setInitialCustomMessage(initialMsg); // 초기 메시지 저장
		setContextTripName(tripName); // 트립 이름 저장
		setModalError(null); // 새로운 모달 열기 전 에러 초기화
		setIsModalSuccess(false); // 새로운 모달 열기 전 성공 상태 초기화
		setShowConfirmModal(true);
	}, []);

	// 모달을 닫는 함수
	const closeConfirmModal = useCallback(() => {
		setShowConfirmModal(false);
		setModalActionType(null);
		setCurrentOnConfirmCallback(null);
		setInitialCustomMessage(null);
		setModalError(null);
		setIsModalSuccess(false);
		setContextTripName(undefined);
	}, []);

	// 모달 내부의 '확인' 버튼 클릭 시 실제 액션 실행 및 결과 처리
	const handleConfirmAction = useCallback(async () => {
		// 이미 결과가 표시된 모달에서 'Ok' 또는 'Close' 버튼을 누른 경우, 모달을 닫기만 함
		if (modalError || isModalSuccess) {
			closeConfirmModal();
			return;
		}

		if (!currentOnConfirmCallback) {
			setModalError("No action defined for this confirmation.");
			setIsModalSuccess(false);
			return;
		}

		setModalError(null); // 실행 전 에러 초기화
		setIsModalSuccess(false); // 실행 전 성공 상태 초기화

		try {
			await currentOnConfirmCallback(); // 전달받은 비동기 액션 실행
			setIsModalSuccess(true); // 성공 시 상태 업데이트
		} catch (err: any) {
			setModalError(err.message || "An unknown error occurred during the action.");
			setIsModalSuccess(false); // 실패 시 상태 업데이트
		}
		// 작업 완료 후 모달을 바로 닫지 않고, 사용자가 'Ok'/'Close' 버튼을 누를 때까지 기다림.
	}, [currentOnConfirmCallback, modalError, isModalSuccess, closeConfirmModal]);


	const { title, message, confirmButtonText, confirmButtonColor } = getModalContent();

	return {
		showConfirmModal,
		modalTitle: title,
		modalMessage: message,
		confirmButtonText,
		confirmButtonColor,
		modalError: modalError,
		isModalSuccess: isModalSuccess,
		openConfirmModal,
		closeConfirmModal,
		handleConfirmAction,
	};
};

export default useConfirmModal;