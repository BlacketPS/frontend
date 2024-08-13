import { useEffect, useRef, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { Modal, Form, Input, Button, ErrorContainer } from "@components/index";

import { LookupUserModalProps } from "../dashboard.d";

export default function LookupUserModal({ onClick }: LookupUserModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    const { closeModal } = useModal();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <Modal.ModalHeader>
                Lookup User
            </Modal.ModalHeader>
            <Modal.ModalBody>Which user's statistics do you wish to lookup?</Modal.ModalBody>

            <Form>
                <Input ref={inputRef} icon="fas fa-user" placeholder="Username" value={username} onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                }} maxLength={64} autoComplete="off" />
            </Form>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    if (username.trim() === "") return setError("Where's the username?");
                    if (username.includes("%")) return setError("Percent signs are not allowed in usernames.");

                    setLoading(true);
                    onClick(username)
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Lookup</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
