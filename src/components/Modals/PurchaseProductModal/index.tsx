import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useSound } from "@stores/SoundStore/index";
import { Modal, ErrorContainer, Button, StripeElementsWrapper, ImageOrVideo, Dropdown, Toggle, ParticleCanvas, Input } from "@components/index";
import { ParticleCanvasRef } from "@components/ParticleCanvas/particleCanvas";
import { useSelect } from "@controllers/stripe/payment-methods/useSelect";
import styles from "./purchaseProductModal.module.scss";

import { ProductPurchaseModalProps, ProductSuccessModalProps } from "./productPurchaseModal.d";
import { RarityAnimationTypeEnum, UserPaymentMethod } from "@blacket/types";

function SuccessModalOutside() {
    const particleCanvasRef = useRef<ParticleCanvasRef>(null);

    const { defineSounds, playSound, playSounds, stopSounds } = useSound();

    useEffect(() => {
        if (!particleCanvasRef.current) return;

        particleCanvasRef.current.start();

        defineSounds([
            { id: "party-popper", url: window.constructCDNUrl("/content/audio/sound/party-popper.mp3") },
            { id: "cha-ching", url: window.constructCDNUrl("/content/audio/sound/cha-ching.mp3") },
            { id: "token-shower", url: window.constructCDNUrl("/content/audio/sound/token-shower.mp3") }
        ])
            .then(() => {
                setTimeout(() => {
                    playSound("party-popper");
                }, 100);

                setTimeout(() => {
                    playSounds(["cha-ching", "token-shower"]);
                }, 400);
            });

        const stopTimeout = setTimeout(() => {
            if (particleCanvasRef.current) particleCanvasRef.current.stop();
        }, 2500);

        return () => {
            stopSounds(["cha-ching", "token-shower"]);
            clearTimeout(stopTimeout);
        };
    }, []);

    return (
        <ParticleCanvas
            ref={particleCanvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: -1
            }}
            images={[
                window.constructCDNUrl("/content/token.png"),
                window.constructCDNUrl("/content/gem.png")
            ]}
            particleWidth={50}
            particleHeight={50}
            particleCount={800}
            animationType={RarityAnimationTypeEnum.LEGENDARY}
        />
    );
}

function SuccessModal({ product, quantity, subscription }: ProductSuccessModalProps) {
    const { closeModal } = useModal();
    const { resourceIdToPath } = useResource();

    return (
        <>
            <Modal.ModalHeader>🎉 Purchase Successful!</Modal.ModalHeader>

            <Modal.ModalBody>
                You have received the following product:
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
                            {!product.isQuantityCapped ? `x${quantity} ` : ""}{product.name}
                        </span>
                        <span>${((subscription ? (product.subscriptionPrice ?? 0) : product.price) * quantity).toFixed(2)} USD</span>
                    </div>
                </div>

                Thank you for supporting {import.meta.env.VITE_INFORMATION_NAME} ❤️
            </Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={closeModal}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}

function TheModal({ product, subscription = false }: ProductPurchaseModalProps) {
    const stripe = useStripe();
    const { user } = useUser();
    const { createModal, closeModal } = useModal();
    const { resourceIdToPath } = useResource();
    const { selectPaymentMethod } = useSelect();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<UserPaymentMethod | null>(
        user?.paymentMethods.find((method) => method.primary) ?? null
    );
    const [quantity, setQuantity] = useState<string>("1");
    const [accepted, setAccepted] = useState<boolean>(false);

    if (!stripe || !user) return null;

    const showSuccessModal = () => {
        createModal(<SuccessModal product={product} quantity={parseInt(quantity)} subscription={subscription} />, <SuccessModalOutside />);
        closeModal();
    };

    return (
        <>
            <Modal.ModalHeader>Review Purchase</Modal.ModalHeader>

            <Modal.ModalBody>
                Please review your purchase below.
            </Modal.ModalBody>

            <Modal.ModalBody>
                <div className={styles.purchaseDetailsContainer}>
                    <span className={styles.purchaseDetailsText}>{subscription ? "Subscription" : "Product"} Details</span>

                    <div className={styles.purchaseDetails}>
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <ImageOrVideo
                                src={resourceIdToPath(product.imageId)}
                                className={styles.productImage}
                            />
                            {!product.isQuantityCapped && <>x<Input
                                value={quantity.toString()}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const parsedValue = parseInt(value);

                                    if (value.match(/[^0-9]/)) return;
                                    if (parsedValue < 1 && value !== "") return;
                                    if (parsedValue > 100) return setQuantity("100"); // Limit to 100 for practical reasons

                                    if (value === "") return setQuantity("");
                                    setQuantity(parsedValue.toString());
                                    setError("");
                                }}
                                containerProps={{ style: { width: 35, height: 20, margin: "0 10px 0 0", border: "unset", borderRadius: 7 } }}
                                style={{ height: 20, width: 30, margin: "unset", borderRadius: 7 }}
                                autoComplete="off"
                            />{" "}</>}{product.name}
                        </span>
                        <span>${((subscription ? (product.subscriptionPrice ?? 0) : product.price) * parseInt(quantity !== "" ? quantity : "1")).toFixed(2)} USD</span>
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
                        } else {
                            setSelectedPaymentMethod(user.paymentMethods.find((method) => method.id === value) ?? null);
                        }
                    }}
                >
                    {selectedPaymentMethod ? `${selectedPaymentMethod.cardBrand} ${selectedPaymentMethod.lastFour}` : "Select a payment method..."}
                </Dropdown>
            </Modal.ModalBody>

            <Modal.ModalBody>
                <Toggle
                    checked={accepted}
                    onClick={() => {
                        if (loading) return;
                        setAccepted(!accepted);
                    }}
                >
                    <div style={{ marginLeft: 5, fontSize: "0.8rem", textAlign: "left" }}>
                        I agree to the <Link to="/terms">Terms of Service</Link> and I understand that I
                        <br />
                        waive the right to withdrawal from this purchase.
                    </div>
                </Toggle>
            </Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton
                    onClick={async () => {
                        if (!accepted) return setError("You must agree to the Terms of Service and Purchase Policy.");
                        if (quantity === "" || parseInt(quantity) < 1) return setError("You must select a quantity of at least 1.");
                        if (!selectedPaymentMethod) return setError("You must select a payment method.");

                        setLoading(true);

                        if (subscription) selectPaymentMethod(selectedPaymentMethod.id)
                            .then(() => window.fetch2.post(`/api/stripe/invoice/${product.id}`, {})
                                .then(async () => {
                                    showSuccessModal();
                                })
                                .catch((err) => {
                                    setError(err?.data?.message ?? "Something went wrong.");
                                    setLoading(false);
                                }))
                            .catch((err) => {
                                setError(err?.data?.message ?? "Something went wrong.");
                                setLoading(false);
                            });
                        else window.fetch2.post(`/api/stripe/payment-intent/${product.id}`, {
                            quantity: parseInt(quantity),
                            paymentMethodId: selectedPaymentMethod.id
                        })
                            .then(async (res) => {
                                const { error: verifyError } = await stripe.confirmCardPayment(res.data.client_secret);
                                if (verifyError) return setError(verifyError?.message ?? "Something went wrong.");

                                showSuccessModal();
                            })
                            .catch((err) => {
                                setError(err?.data?.message ?? "Something went wrong.");
                                setLoading(false);
                            });
                    }}
                >
                    {subscription ? "Subscribe" : "Purchase"}
                </Button.GenericButton>

                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}

export default function PurchaseProductModal({ product, subscription }: ProductPurchaseModalProps) {
    return (
        <StripeElementsWrapper>
            <TheModal product={product} subscription={subscription} />
        </StripeElementsWrapper>
    );
}
