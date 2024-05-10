import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@stores/ModalStore/index";
import { Modal, Form, Input, Button } from "@components/index";

export default function LookupUserModal() {
    const [user, setUser] = useState<string>("");

    const { closeModal } = useModal();

    const navigate = useNavigate();

    return (
        <>
            <Modal.ModalHeader>
                Lookup User
            </Modal.ModalHeader>
            <Modal.ModalBody>Which user's statistics do you wish to lookup?</Modal.ModalBody>

            <Form>
                <Input icon="fas fa-user" placeholder="Username" value={user} onChange={(e) => {
                    setUser(e.target.value);
                }} autoComplete="off" />
            </Form>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    navigate(`/dashboard?name=${user}`);

                    closeModal();
                }}>Lookup</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
