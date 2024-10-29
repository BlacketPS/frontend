import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useModal } from "@stores/ModalStore/index";
import { useCreateSetupIntent } from "@controllers/stripe/setup-intent/useCreateSetupIntent/index";
import { useCreate } from "@controllers/stripe/payment-methods/useCreate/index";
import { Modal, ErrorContainer, Button, StripeElementsWrapper } from "@components/index";
import styles from "./addPaymentMethodModal.module.scss";

function TheModal() {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { closeModal } = useModal();
    const { createSetupIntent } = useCreateSetupIntent();
    const { createPaymentMethod } = useCreate();

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color");

    if (!stripe || !elements) return;

    return (
        <>
            <Modal.ModalHeader>Add Payment Method</Modal.ModalHeader>

            <Modal.ModalBody>
                Please enter your card information below.
            </Modal.ModalBody>

            <Modal.ModalBody>
                <div className={styles.cardContainer}>
                    <CardElement
                        options={{
                            disableLink: true,
                            style: {
                                base: {
                                    iconColor: accentColor,
                                    color: accentColor,
                                    fontSize: "18px",
                                    fontFamily: "Nunito, sans-serif"
                                },
                                invalid: {
                                    color: "#ff0000"
                                }
                            }
                        }}
                        onChange={(e) => {
                            if (e.error) setError(e.error.message);
                            else setError("");
                        }}
                    />
                </div>
            </Modal.ModalBody>

            <Modal.ModalBody style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                We use Stripe to handle all of our payment processing.
                <br />
                None of your payment information is stored on our servers.
            </Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton
                    onClick={async () => {
                        const cardElement = elements.getElement(CardElement);
                        if (!cardElement) return;

                        setLoading(true);

                        const result = await stripe.createPaymentMethod({
                            type: "card",
                            card: cardElement
                        })
                            .catch((error) => {
                                setError(error.message);
                                setLoading(false);
                            });

                        if (!result) return setLoading(false);
                        if (result.error) return setError(result?.error?.message ?? "Something went wrong."), setLoading(false);

                        const setupIntent = await createSetupIntent({ paymentMethodId: result.paymentMethod.id })
                            .catch((error: Fetch2Response) => {
                                setError(error?.data?.message ?? "Something went wrong.");
                                setLoading(false);
                            });
                        if (!setupIntent) return setLoading(false);

                        const { error: verifyError } = await stripe.confirmCardSetup(setupIntent.clientSecret, { payment_method: { card: cardElement } });
                        if (verifyError) return setError(verifyError?.message ?? "Something went wrong."), setLoading(false);

                        await createPaymentMethod({
                            setupIntentId: setupIntent.id
                        })
                            .then(() => closeModal())
                            .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                            .finally(() => setLoading(false));
                    }}
                >
                    Add
                </Button.GenericButton>

                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}

export default function AddPaymentMethodModal() {
    return (
        <StripeElementsWrapper>
            <TheModal />
        </StripeElementsWrapper>
    );
}