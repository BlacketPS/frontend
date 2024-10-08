import { useEffect, useRef, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useSquare } from "@stores/SquareStore/index";
import { useCreate } from "@controllers/store/payment-methods/useCreate/index";
import { Modal, ErrorContainer, Input, Loader } from "@components/index";
import { GenericButton } from "@components/Buttons";
import { Card } from "@square/web-sdk";

export default function AddPaymentMethodModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [cardLoading, setCardLoading] = useState<boolean>(true);
    const squareCardRef = useRef<Card | null>(null);
    const [cardName, setCardName] = useState<string>("");

    const { payments } = useSquare();
    const { closeModal } = useModal();
    const { createPaymentMethod } = useCreate();

    useEffect(() => {
        if (!payments) return;

        const attachCard = async () => {
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color");
            const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background-color");

            const card = await payments.card({
                style: {
                    input: { backgroundColor: backgroundColor, color: accentColor, fontSize: "16px" },
                    ".input-container": { borderWidth: "0px", borderRadius: "7px" },
                    ".input-container.is-error": { borderWidth: "0px" },
                    ".input-container.is-focus": { borderWidth: "0px" },
                    "input::placeholder": { color: "#ffffff" },
                    ".message-icon": { color: "transparent" },
                    ".message-text": { color: "transparent" },
                    ".message-icon.is-error": { color: "transparent" },
                    ".message-text.is-error": { color: "transparent" }
                }
            });
            if (!card) return;

            card.attach("#square-card");
            squareCardRef.current = card;
            setCardLoading(false);
        };

        attachCard();
    }, []);

    return (
        <>
            <Modal.ModalHeader>Add Payment Method</Modal.ModalHeader>

            <Modal.ModalBody>
                Please enter your card information below.
            </Modal.ModalBody>

            <Modal.ModalBody>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", width: "335px" }}>
                    <div
                        id="square-card"
                        style={{
                            borderRadius: "7px",
                            height: 100,
                            marginBottom: 10
                        }}
                        onClick={() => setError("")}
                    >
                        {
                            cardLoading &&
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Loader
                                    noModal
                                    style={{
                                        marginBottom: 20,
                                        transform: "scale(1.5)"
                                    }}
                                />
                            </div>
                        }
                    </div>

                    <Input
                        type="text"
                        icon="fas fa-user"
                        placeholder="Name on Card"
                        value={cardName}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value.match(/[^a-zA-Z ]/g)) return;
                            if (value.split(" ").length > 2) return;

                            setCardName(value);
                        }}
                        containerProps={{ style: { margin: "unset", width: "100%" } }}
                    />
                </div>
            </Modal.ModalBody>

            <Modal.ModalBody style={{ fontSize: "0.8rem" }}>
                We use Square to handle all of our payment processing.
                <br />
                None of your payment information is stored on our servers.
            </Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <GenericButton
                    onClick={async () => {
                        if (cardName === "") return setError("Please enter a name on the card.");

                        const name = cardName.split(" ");
                        if (name.length !== 2) return setError("Please enter a first and last name on the card.");

                        setLoading(true);

                        const result = await squareCardRef.current?.tokenize()
                            .catch((error) => {
                                setError(error.errors[0].message);
                                setLoading(false);
                            });

                        if (!result) return setLoading(false);
                        if (result?.errors) return setError(result.errors[0].message), setLoading(false);

                        await createPaymentMethod({
                            firstName: name[0],
                            lastName: name[1],
                            cardNonce: result.token as string
                        })
                            .then(() => closeModal())
                            .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                            .finally(() => setLoading(false));
                    }}
                >
                    Add
                </GenericButton>

                <GenericButton onClick={closeModal}>Cancel</GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
