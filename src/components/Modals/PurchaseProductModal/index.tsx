import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { Modal, ErrorContainer, Button, StripeElementsWrapper, ImageOrVideo } from "@components/index";

import { ProductPurchaseModalProps } from "./productPurchaseModal.d";

function TheModal({ product }: ProductPurchaseModalProps) {
    const stripe = useStripe();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { closeModal } = useModal();
    const { resourceIdToPath } = useResource();

    if (!stripe) return;

    return (
        <>
            <Modal.ModalHeader>{product.name}</Modal.ModalHeader>

            <Modal.ModalBody>
                {product.description}
            </Modal.ModalBody>

            <Modal.ModalBody>
                Are you sure you want to purchase this product?
                <br />
                This product costs ${product.price}.

                <ImageOrVideo src={resourceIdToPath(product.imageId)} />
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
