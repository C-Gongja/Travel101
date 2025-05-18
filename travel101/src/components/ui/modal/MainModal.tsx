import React, { useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const handleClickOutside = (e: any) => {
		// modal div 밖을 클릭했을 때만 모달을 닫음
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			onClick={handleClickOutside}
		>
			<div className="modal p-[20px] rounded-xl shadow-lg relative">
				<button className="absolute top-4 right-4 text-gray-600 hover:text-maincolor" onClick={onClose}>
					<IoIosCloseCircle className="text-3xl" />
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
