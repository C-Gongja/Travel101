import { useAuthModalStore } from "@/store/user/useAuthModalStore";
import Modal from "../ui/modal/MainModal";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthModal() {
	const { isOpen, onClose, isSignUp } = useAuthModalStore();

	if (!isOpen) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			{isSignUp ? (
				<SignUpForm />
			) : (
				<SignInForm />
			)}
		</Modal>
	);
}