import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { Modal, ErrorContainer, Button, StripeElementsWrapper, ImageOrVideo, Dropdown } from "@components/index";
import styles from "./purchaseProductModal.module.scss";

import { ProductPurchaseModalProps } from "./productPurchaseModal.d";
import { UserPaymentMethod } from "@blacket/types";

function TheModal({ product }: ProductPurchaseModalProps) {
    const stripe = useStripe();

    const { user } = useUser();

    if (!stripe || !user) return;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<UserPaymentMethod | null>(user.paymentMethods.find((method) => method.primary) ?? null);

    const { createModal, closeModal } = useModal();
    const { resourceIdToPath } = useResource();

    return (
        <>
            <Modal.ModalHeader>Review Purchase</Modal.ModalHeader>

            <Modal.ModalBody>
                Please review your purchase below.
            </Modal.ModalBody>

            <Modal.ModalBody>
                <div className={styles.purchaseDetailsContainer}>
                    <span className={styles.purchaseDetailsText}>Purchase Details</span>

                    <div className={styles.purchaseDetails}>
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <ImageOrVideo
                                src={resourceIdToPath(product.imageId)}
                                className={styles.productImage}
                            />
                            {product.name}
                        </span>
                        <span>${product.price}</span>
                    </div>
                </div>

                <Dropdown
                    options={[
                        ...user.paymentMethods.map((method) => ({
                            label: `${method.cardBrand} ${method.lastFour}`, value: method.id
                        })),
                        { label: "Add Payment Method", value: null }
                    ]}
                    onChange={(value: number | null) => {
                        if (value === null) {
                            closeModal();

                            createModal(<Modal.AddPaymentMethodModal />);
                        } else setSelectedPaymentMethod(user.paymentMethods.find((method) => method.id === value) ?? null);
                    }}
                >
                    {selectedPaymentMethod ? `${selectedPaymentMethod.cardBrand} ${selectedPaymentMethod.lastFour}` : "Select a payment method..."}
                </Dropdown>
            </Modal.ModalBody>

            <Modal.ModalBody style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                By clicking "Purchase", you agree to our Terms of Service <br /> You will immediately be charged for this purchase.
            </Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton
                    onClick={async () => {
                        setLoading(true);

                        window.fetch2.post(`/api/stripe/payment-intent/${product.id}`, {})
                            .then(async (res) => {
                                const { error: verifyError } = await stripe.confirmCardPayment(res.data.client_secret);
                                if (verifyError) return setError(verifyError?.message ?? "Something went wrong.");

                                closeModal();
                            })
                            .catch((err) => setError(err?.data?.message ?? "Something went wrong."))
                            .finally(() => setLoading(false));
                    }}
                >
                    Purchase
                </Button.GenericButton>

                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}

export default function PurchaseProductModal({ product }: ProductPurchaseModalProps) {
    return (
        <StripeElementsWrapper>
            <TheModal product={product} />
        </StripeElementsWrapper>
    );
}
