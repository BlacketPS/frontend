import { useModal } from "@stores/ModalStore";
import { Modal } from "@components/index";
import { GenericButton } from "@components/Buttons";

import { ErrorModalProps } from "./errorModal.d";

export default function ErrorModal({ onClick, children }: ErrorModalProps) {
    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Error</Modal.ModalHeader>
            <Modal.ModalBody>{children ? children : "Something went wrong."}</Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <GenericButton onClick={() => {
                    if (onClick) onClick();
                    closeModal();
                }}>Okay</GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
