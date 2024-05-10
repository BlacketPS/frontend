import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore";
import { useSellBlooks } from "@controllers/blooks/useSellBlooks/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";

import { SellBlooksModalProps } from "../blooks.d";

export default function SellBlooksModal({ blook }: SellBlooksModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);

    const { sellBlooks } = useSellBlooks();

    const { closeModal } = useModal();
    const { user } = useUser();

    return (
        <>
            <Modal.ModalHeader>Sell {blook.name} Blook(s) for {blook.price} tokens</Modal.ModalHeader>

            <Modal.ModalBody>How many Blooks would you like to sell?</Modal.ModalBody>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Form style={{ width: "75px" }}>
                    <Input value={quantity} style={{ fontSize: "25px" }} onChange={(e) => {
                        setQuantity(parseInt(e.target.value));
                        setError("");
                    }} autoComplete="off" />
                </Form>
                <Modal.ModalBody style={{ padding: "0 5px 15px", fontSize: "30px" }}>/ {user.blooks[blook.id] || 0}</Modal.ModalBody>
            </div>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={() => {
                    setLoading(true);
                    sellBlooks({ blookId: blook.id, quantity })
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Sell</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
