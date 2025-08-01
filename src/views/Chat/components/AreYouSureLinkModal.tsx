import { useModal } from "@stores/ModalStore";
import { Modal, Button } from "@components/index";

import { AreYouSureLinkModalProps } from "../chat.d";

export default function OpenPackModal({ link }: AreYouSureLinkModalProps) {
    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Warning</Modal.ModalHeader>

            <Modal.ModalBody>
                This link will take you to an external website ({link})
                <br />
                Are you sure you want to go there?
            </Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    window.open(link, "_blank");

                    closeModal();
                }}>Yes</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>No</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
