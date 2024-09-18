import { useModal } from "@stores/ModalStore";
import { Modal, Button } from "@components/index";

export default function NotificationAccessModal() {
    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Notification Access</Modal.ModalHeader>

            <Modal.ModalBody>
                {import.meta.env.VITE_INFORMATION_NAME} requires access to notifications to function properly.
                <br />
                Please allow notifications to continue.
            </Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    Notification.requestPermission()
                        .then(() => closeModal());
                }}>Allow</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
