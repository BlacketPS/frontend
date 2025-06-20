import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@components/index";
import { useModal } from "@stores/ModalStore/index";

import { TooFastModalProps } from "../rules.d";
import { useEffect } from "react";

export default function TooFastModal({ startedReading }: TooFastModalProps) {
    const { closeModal } = useModal();

    const [seconds] = useState(Math.floor((Date.now() - startedReading.getTime()) / 1000));
    const [canProceed, setCanProceed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setCanProceed(true), 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Modal.ModalHeader>Too Fast!</Modal.ModalHeader>

            <Modal.ModalBody>
                You've only read the rules for {seconds} second{seconds !== 1 ? "s" : ""}. Are you sure?
                <br />
                <br />
                Violating these rules even unknowingly can result in a permanent ban.
                <br />
                Please make sure you understand what you're agreeing to.
            </Modal.ModalBody>

            {<Modal.ModalButtonContainer>
                <Button.GenericButton
                    style={{
                        pointerEvents: !canProceed ? "none" : undefined,
                        opacity: !canProceed ? 0.5 : 1
                    }}
                    onClick={() => {
                        if (!canProceed) return;

                        closeModal();

                        window.fetch2.patch("/api/users/read-rules", {});

                        navigate("/dashboard");
                    }}
                >
                    I Agree
                </Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>}
        </>
    );
}
