import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { usePassword } from "@controllers/settings/usePassword/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";

export default function ChangePasswordModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const { changePassword } = usePassword();

    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Change Password</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the form below to change your password.</Modal.ModalBody>

            <Form>
                <Input icon="fas fa-lock" placeholder="Old Password" type="password" value={oldPassword} onChange={(e) => {
                    setOldPassword(e.target.value);
                    setError("");
                }} autoComplete="password" />

                <Input icon="fas fa-lock" placeholder="New Password" type="password" value={newPassword} onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                }} autoComplete="off" />
            </Form>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    setLoading(true);
                    changePassword({ oldPassword, newPassword })
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Change</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
