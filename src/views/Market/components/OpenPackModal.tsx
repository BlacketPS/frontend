import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useModal } from "@stores/ModalStore/index";
import { useBlook } from "@stores/BlookStore";
import { Modal, Button, ErrorContainer } from "@components/index";
import styles from "../market.module.scss";

import { OpenPackModalProps } from "../market.d";

export default function OpenPackModal({ pack, userTokens, onYesButton }: OpenPackModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { closeModal } = useModal();
    const { blooks } = useBlook();

    if (userTokens < pack.price) return (
        <>
            <Modal.ModalHeader>Error</Modal.ModalHeader>

            <Modal.ModalBody>You do not have enough tokens to purchase this pack.</Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => closeModal()}>Okay</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
    else return (
        <>
            <Tooltip id="tooltip" place="left">
                {blooks.sort((a, b) => a.priority - b.priority).map((blook) => blook.packId === pack.id && <div key={blook.id}>
                    {blook.name}: {blook.chance}%
                </div>)}
            </Tooltip>

            <Modal.ModalHeader>
                <i className={`${styles.packRatesIcon} far fa-question-circle`} data-tooltip-id="tooltip" />
                {pack.name} Pack
            </Modal.ModalHeader>
            <Modal.ModalBody>Would you like to purchase this pack for <img className={styles.tokenPrice} src="https://cdn.blacket.org/static/content/token.png" /> {pack.price} tokens?</Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    setLoading(true);
                    onYesButton({ packId: pack.id })
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Yes</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>No</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
