import Modal from "../ui/modals/mainModal";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthModal({
	isOpen,
	onClose,
	isSignUp,
	setIsSignUp,
}: {
	isOpen: boolean;
	onClose: () => void;
	isSignUp: boolean;
	setIsSignUp: (val: boolean) => void;
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			{isSignUp ? (
				<SignUpForm setIsSignUp={setIsSignUp} onClose={onClose} />
			) : (
				<SignInForm setIsSignUp={setIsSignUp} onClose={onClose} />
			)}
		</Modal>
	);
}