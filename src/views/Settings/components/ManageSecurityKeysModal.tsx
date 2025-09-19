import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { Modal, Button, ErrorContainer } from "@components/index";
import { SecurityKey } from ".";
import { useGenerateRegistration } from "@controllers/auth/webauthn/useGenerateRegistration/index";
import { useVerifyRegistration } from "@controllers/auth/webauthn/useVerifyRegistration/index";
import styles from "../settings.module.scss";

export default function ManageSecurityKeysModal() {
    const { user } = useUser();
    if (!user) return null;

    const { closeModal } = useModal();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { generateRegistration } = useGenerateRegistration();
    const { verifyRegistration } = useVerifyRegistration();

    return (
        <>
            <Modal.ModalHeader>Security Keys</Modal.ModalHeader>
            <Modal.ModalBody>Manage your security keys here.</Modal.ModalBody>

            <Modal.ModalBody>
                <div className={styles.securityKeys}>
                    {/* <SecurityKey name="YubiKey 5 NFC" createdAt={
                        new Date("2023-10-01T12:00:00Z")
                    } onRemove={() => alert("Remove YubiKey 5 NFC")} /> */}
                    {user.authMethods.length < 1 && <div className={styles.noKeys}>No security keys added.</div>}
                    {user.authMethods.map((key) => (
                        <SecurityKey key={key.id} name={key.nickname || "Unnamed"} createdAt={new Date(key.createdAt)} onRemove={() => { }} />
                    ))}
                </div>
            </Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={async () => {
                    if (!("credentials" in navigator)) return setError("WebAuthn is not supported in this browser.");

                    setLoading(true);

                    const { data } = await generateRegistration();

                    const options = {
                        ...data,
                        challenge: Uint8Array.from((data.challenge), (c) => (c as any).charCodeAt(0)),
                        user: {
                            ...data.user,
                            id: Uint8Array.from((data.user.id), (c) => (c as any).charCodeAt(0))
                        }
                    };

                    let credential: any;

                    try {
                        credential = await navigator.credentials.create({ publicKey: options });
                    } catch (err) {
                        setLoading(false);

                        return;
                    }

                    if (!credential) {
                        setLoading(false);
                        setError("Failed to create credential.");

                        return;
                    }

                    let challenge: string;

                    try {
                        const clientDataJSON = new TextDecoder().decode(credential.response.clientDataJSON);

                        challenge = JSON.parse(clientDataJSON).challenge;
                    } catch {
                        setLoading(false);
                        setError("Failed to parse challenge.");

                        return;
                    }

                    await verifyRegistration({
                        credential,
                        challenge
                    })
                        .then(() => setLoading(false))
                        .catch((err) => {
                            setLoading(false);
                            setError(err.data.message || "Something went wrong.");
                        });
                }}>Add</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
