import { useEffect, useRef, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore";
import { useSellBlooks } from "@controllers/blooks/useSellBlooks/index";
import { Modal, Button, Form, Input, ErrorContainer } from "@components/index";

import { SellBlooksModalProps } from "../inventory";

export default function SellBlooksModal({ blook }: SellBlooksModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");

    const { sellBlooks } = useSellBlooks();

    const { closeModal } = useModal();
    const { user } = useUser();

    const inputRef = useRef<HTMLInputElement>(null);

    const submit = () => {
        setLoading(true);
        sellBlooks({ blookId: blook.id, quantity: parseInt(quantity) })
            .then(() => closeModal())
            .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    if (!user) return null;

    return (
        <>
            <Modal.ModalHeader>Sell {blook.name} Blook(s) for {blook.price} tokens</Modal.ModalHeader>

            <Modal.ModalBody>How many Blooks would you like to sell?</Modal.ModalBody>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Form style={{ width: "75px" }} onSubmit={submit}>
                    <Input ref={inputRef} value={quantity} style={{ fontSize: "25px" }} onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseInt(value);

                        if (value.match(/[^0-9]/)) return;
                        if (parsedValue < 1 && value !== "") return;
                        if (parsedValue > user.blooks[blook.id]) return setQuantity(user.blooks[blook.id].toString());

                        setQuantity(e.target.value);
                        setError("");
                    }} autoComplete="off" />
                </Form>
                <Modal.ModalBody style={{ padding: "0 5px 15px", fontSize: "30px" }}>/ {user.blooks[blook.id] || 0}</Modal.ModalBody>
            </div>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Sell</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
