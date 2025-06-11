import { useEffect, useRef, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore";
import { useResource } from "@stores/ResourceStore/index";
import { useSellBlooks } from "@controllers/blooks/useSellBlooks/index";
import { Modal, Button, Form, ErrorContainer, Blook, Input } from "@components/index";
import styles from "../inventory.module.scss";

import { SellBlooksModalProps } from "../inventory";

export default function SellBlooksModal({ blook, shiny }: SellBlooksModalProps) {
    const { user } = useUser();
    if (!user) return null;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedBlooks, setSelectedBlooks] = useState<number[]>([]);

    const { sellBlooks } = useSellBlooks();

    const { closeModal } = useModal();
    const { resourceIdToPath } = useResource();

    const inputRef = useRef<HTMLInputElement>(null);

    const getUserBlookQuantity = () => {
        return user.blooks.filter((b) => b.blookId === blook.id && b.shiny === shiny).length;
    };

    const submit = () => {
        setLoading(true);
        if (selectedBlooks.length === 0) {
            setLoading(false);
            return setError("Please select at least one blook to sell.");
        }

        sellBlooks({ blooks: selectedBlooks })
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
            <Modal.ModalHeader>Sell {shiny && "Shiny"} {blook.name} Blook(s) for {blook.price * (shiny ? 10 : 1)} tokens</Modal.ModalHeader>

            <Modal.ModalBody>Please select the blooks you would like to sell.</Modal.ModalBody>

            <div className={styles.sellBlooksContainer}>
                <div className={styles.sellBlooks}>
                    {user.blooks
                        .filter((userBlook) => userBlook.blookId === blook.id)
                        .filter((userBlook) => userBlook.shiny === shiny)
                        .map((userBlook) => <div
                            key={userBlook.id}
                            className={styles.sellBlook}
                            data-selected={selectedBlooks.includes(userBlook.id) ? "true" : "false"}
                            onClick={() => {
                                if (selectedBlooks.includes(userBlook.id)) setSelectedBlooks((prev) => prev.filter((id) => id !== userBlook.id));
                                else setSelectedBlooks((prev) => [...prev, userBlook.id]);
                            }}
                        >
                            <div className={styles.sellBlookImageContainer}>
                                <Blook
                                    className={styles.sellBlookImage}
                                    src={resourceIdToPath(blook.imageId)}
                                    shiny={userBlook.shiny}
                                />
                            </div>

                            <div className={styles.sellBlookInformation}>
                                <div>{shiny && "Shiny"} {blook.name}</div>
                                <div>Serial: {userBlook.serial ? `#${userBlook.serial}` : "V2 Blook (N/A)"}</div>
                            </div>
                        </div>)
                    }
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Form style={{ width: "75px" }} onSubmit={submit}>
                    <Input ref={inputRef} value={selectedBlooks.length.toString()} style={{ fontSize: "25px" }} onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseInt(value);

                        if (value.match(/[^0-9]/)) return;
                        if (parsedValue < 1 && value !== "") return;
                        if (parsedValue > getUserBlookQuantity()) return setSelectedBlooks(user.blooks
                            .filter((userBlook) => userBlook.blookId === blook.id)
                            .filter((userBlook) => userBlook.shiny === shiny)
                            .map((userBlook) => userBlook.id)
                        );

                        if (value === "") return setSelectedBlooks([]);
                        setSelectedBlooks(user.blooks
                            .filter((userBlook) => userBlook.blookId === blook.id)
                            .filter((userBlook) => userBlook.shiny === shiny)
                            .sort((a, b) => (b.serial || 0) - (a.serial || 0))
                            .slice(0, parsedValue)
                            .map((userBlook) => userBlook.id)
                        );

                        setError("");
                    }} autoComplete="off" />
                </Form>
                <Modal.ModalBody style={{ padding: "0 5px 15px", fontSize: "30px" }}>/ {getUserBlookQuantity()}</Modal.ModalBody>
            </div>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Sell</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
