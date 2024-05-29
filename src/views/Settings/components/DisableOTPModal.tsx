import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useDisable } from "@controllers/settings/otp/useDisable/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";

export default function DisableOTPModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [otpCode, setOTPCode] = useState<string>("");

    const { disable } = useDisable();

    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Disable OTP</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the form below to disable OTP.</Modal.ModalBody>

            <Form>
                <Input icon="fas fa-key" placeholder="OTP / 2FA Code" value={otpCode} onChange={(e) => {
                    setOTPCode(e.target.value);
                    setError("");
                }} autoComplete="off" />
            </Form>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    setLoading(true);
                    disable({ otpCode })
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Disable</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
