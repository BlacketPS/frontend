import { useEffect, useRef, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useGenerate } from "@controllers/auth/otp/useGenerate/index";
import { useEnable } from "@controllers/settings/otp/useEnable/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";
import { toDataURL } from "qrcode";

import { GenerateResponse } from "@controllers/auth/otp/useGenerate/useGenerate";

export default function EnableOTPModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [qrCodeImage, setQRCodeImage] = useState<string>("");
    const [otpCode, setOTPCode] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    const { generate } = useGenerate();
    const { enable } = useEnable();

    const { closeModal } = useModal();
    const { user } = useUser();

    if (!user) return null;

    useEffect(() => {
        inputRef.current?.focus();

        generate()
            .then((res: GenerateResponse) => {
                toDataURL(`otpauth://totp/${user.username}?secret=${res.data.otpSecret}&issuer=${import.meta.env.VITE_INFORMATION_NAME}`)
                    .then((url: string) => setQRCodeImage(url))
                    .catch(() => setError("Unable to generate QR code."));
            })
            .catch(() => setError("Unable to generate QR code."));
    }, []);

    return (
        <>
            <Modal.ModalHeader>Enable OTP</Modal.ModalHeader>
            <Modal.ModalBody>Please scan the QR code below with your authenticator app.</Modal.ModalBody>

            {qrCodeImage !== "" ? <img src={qrCodeImage} style={{ marginBottom: "10px", borderRadius: "10px" }} /> : <Modal.ModalBody>Loading QR code...</Modal.ModalBody>}

            <Form>
                <Input ref={inputRef} icon="fas fa-key" placeholder="OTP / 2FA Code" value={otpCode} onChange={(e) => {
                    const value = e.target.value;

                    if (value.match(/[^0-9]/)) return;
                    if (value.length > 6) return;

                    setOTPCode(e.target.value);
                    setError("");
                }} autoComplete="off" />
            </Form>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    setLoading(true);
                    enable({ otpCode })
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Enable</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>

            <Modal.ModalBody>After scanning the QR code, please enter the OTP / 2FA code you get from it below.<br />If the code doesn't work, try rescanning the QR code.</Modal.ModalBody>
        </>
    );
}
