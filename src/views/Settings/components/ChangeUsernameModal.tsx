import { useState } from "react";
import { useModal } from "@stores/ModalStore";
import { useUsername } from "@controllers/settings/useUsername/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";

export default function ChangeUsernameModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [newUsername, setNewUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { changeUsername } = useUsername();

    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Change Username</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the form below to change your username.</Modal.ModalBody>

            <Form>
                <Input icon="fas fa-user" placeholder="New Username" value={newUsername} onChange={(e) => {
                    setNewUsername(e.target.value);
                    setError("");
                }} autoComplete="off" />

                <Input icon="fas fa-lock" placeholder="Password" type="password" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                }} autoComplete="password" />
            </Form>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    setLoading(true);
                    changeUsername({ newUsername, password })
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Change</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>

            <Modal.ModalBody>This will allow anyone to take your old username!<br />Take caution while performing this action!</Modal.ModalBody>
        </>
    );
}
