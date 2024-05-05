import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@stores/ModalStore";
import { useLogout } from "@controllers/auth/useLogout/index";
import { Modal, ErrorContainer } from "@components/index";
import { GenericButton } from "@components/Buttons";

export default function LogoutModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    const { closeModal } = useModal();
    const { logout } = useLogout();

    return (
        <>
            <Modal.ModalHeader>Question</Modal.ModalHeader>
            <Modal.ModalBody>Are you sure you want to logout?</Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <GenericButton onClick={() => {
                    setLoading(true);
                    logout()
                        .then(() => {
                            navigate("/login");

                            closeModal();
                        })
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Yes</GenericButton>

                <GenericButton onClick={() => closeModal()}>No</GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
