import { useNavigate } from "react-router-dom";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { Modal, Button, ImageOrVideo, Username } from "@components/index";
import styles from "../credits.module.scss";

import { CreditModalProps } from "../credits.d";

export default function CreditModal({ credit }: CreditModalProps) {
    const { closeModal } = useModal();
    const { getUserAvatarPath } = useUser();

    const navigate = useNavigate();

    return (
        <>
            <Modal.ModalHeader>
                <div className={styles.creditModalAvatarContainer}>
                    <ImageOrVideo className={styles.creditModalAvatar} src={getUserAvatarPath(credit.user)} />
                </div>
                <Username user={credit.user} />
            </Modal.ModalHeader>
            <Modal.ModalBody>{credit.description}</Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    navigate(`/dashboard?name=${credit.user.username}`);

                    closeModal();
                }}>View User</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
