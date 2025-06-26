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
            {/* <Modal.ModalHeader>Sell {shiny && "Shiny"} {blook.name} Blook(s) for {blook.price * (shiny ? 10 : 1)} tokens</Modal.ModalHeader> */}

            {/* <Modal.ModalBody>Please select the blooks you would like to sell.</Modal.ModalBody> */}

            <div className={styles.sellBlooksFlex}>
                <i className={`fas fa-x ${styles.sellBlookExitSell}`} onClick={closeModal} />

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

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "20rem", textAlign: "left" }}>
                    <h1 className={styles.sellBlookBlookName}>{shiny && "Shiny"} {blook.name}</h1>
                    
                    <div className={styles.sellBlookHoldInput}>
                        <div className={styles.sellBlookInput}>
                            <Form style={{ width: "75px", margin: "0 0 0 -5px" }} onSubmit={submit}>
                                <Input ref={inputRef} value={selectedBlooks.length.toString()} style={{ fontSize: "25px", margin: "0 4px" }} onChange={(e) => {
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
                            <p style={{ fontSize: "25px", margin: 0 }}>/ {getUserBlookQuantity()}</p>
                        </div>
                        <div className={styles.sellBlookExtraOptions}>
                            <button 
                                className={styles.sellBlookExtraOptionButton} 
                                onClick={() => {
                                    const newQuantity = Math.min(selectedBlooks.length + 1, getUserBlookQuantity());
                                    setSelectedBlooks(user.blooks
                                        .filter((userBlook) => userBlook.blookId === blook.id)
                                        .filter((userBlook) => userBlook.shiny === shiny)
                                        .sort((a, b) => (b.serial || 0) - (a.serial || 0))
                                        .slice(0, newQuantity)
                                        .map((userBlook) => userBlook.id)
                                    );
                                    setError("");
                                }}
                            >
                                +1
                            </button>
                            {getUserBlookQuantity() >= 5 && (
                                <button 
                                    className={styles.sellBlookExtraOptionButton} 
                                    onClick={() => {
                                        const newQuantity = Math.min(selectedBlooks.length + 5, getUserBlookQuantity());
                                        setSelectedBlooks(user.blooks
                                            .filter((userBlook) => userBlook.blookId === blook.id)
                                            .filter((userBlook) => userBlook.shiny === shiny)
                                            .sort((a, b) => (b.serial || 0) - (a.serial || 0))
                                            .slice(0, newQuantity)
                                            .map((userBlook) => userBlook.id)
                                        );
                                        setError("");
                                    }}
                                >
                                    +5
                                </button>
                            )}
                            {getUserBlookQuantity() >= 10 && (
                                <button 
                                    className={styles.sellBlookExtraOptionButton} 
                                    onClick={() => {
                                        const newQuantity = Math.min(selectedBlooks.length + 10, getUserBlookQuantity());
                                        setSelectedBlooks(user.blooks
                                            .filter((userBlook) => userBlook.blookId === blook.id)
                                            .filter((userBlook) => userBlook.shiny === shiny)
                                            .sort((a, b) => (b.serial || 0) - (a.serial || 0))
                                            .slice(0, newQuantity)
                                            .map((userBlook) => userBlook.id)
                                        );
                                        setError("");
                                    }}
                                >
                                    +10
                                </button>
                            )}
                            {(
                                <button 
                                    className={styles.sellBlookExtraOptionButton} 
                                    onClick={() => {
                                        const newQuantity = getUserBlookQuantity() - 1;
                                        setSelectedBlooks(user.blooks
                                            .filter((userBlook) => userBlook.blookId === blook.id)
                                            .filter((userBlook) => userBlook.shiny === shiny)
                                            .sort((a, b) => (b.serial || 0) - (a.serial || 0))
                                            .slice(0, newQuantity)
                                            .map((userBlook) => userBlook.id)
                                        );
                                        setError("");
                                    }}
                                >
                                    1 LEFT
                                </button>
                            )}
                            <button 
                                className={styles.sellBlookExtraOptionButton} 
                                onClick={() => {
                                    setSelectedBlooks([]);
                                    setError("");
                                }}
                            >
                                <i className="fa-solid fa-arrows-rotate" />
                            </button>
                        </div>
                        <Button.GenericButton onClick={submit} type="submit" style={{width: "100%", marginTop: "7px", fontSize: "1.35rem" }}>
                            Sell for <img src="/media/content/token.png" style={{ width: "20px", margin: "0 7px" }} /> {(selectedBlooks.length * blook.price * (shiny ? 10 : 1)).toLocaleString()} tokens
                        </Button.GenericButton>
                    </div>
                </div>
            </div>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            {/* <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Sell</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer> */}
        </>
    );
}
