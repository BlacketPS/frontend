import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@stores/ModalStore";
import { useLogin } from "@controllers/auth/useLogin/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";

export default function OtpModal({ username, password }: { username: string, password: string }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [otpCode, setOTPCode] = useState("");

    const navigate = useNavigate();

    const { closeModal } = useModal();

    const { login } = useLogin();

    return (
        <>
            <Modal.ModalHeader>OTP Required</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out your OTP code below to login.</Modal.ModalBody>

            <Form>
                <Input icon="fas fa-key" placeholder="OTP / 2FA Code" value={otpCode} onChange={(e) => {
                    setOTPCode(e.target.value);
                    setError("");
                }} autoComplete="off" />
            </Form>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    if (otpCode === "") return setError("Please enter your OTP code.");

                    setLoading(true);
                    login(username, password, otpCode)
                        .then(() => {
                            closeModal();
                            navigate("/dashboard");
                        })
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Login</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
