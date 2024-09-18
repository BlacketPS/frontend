import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useSelect } from "@controllers/store/payment-methods/useSelect/index";
import { useRemove } from "@controllers/store/payment-methods/useRemove/index";
import { Modal, ErrorContainer, Dropdown } from "@components/index";
import { GenericButton } from "@components/Buttons";

import { UserPaymentMethod } from "@blacket/types";

export default function PaymentMethodsModal() {
    const { user } = useUser();

    if (!user) return null;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<UserPaymentMethod | null>(user.paymentMethods.find((method) => method.primary) ?? null);

    const { createModal, closeModal } = useModal();
    const { selectPaymentMethod } = useSelect();
    const { removePaymentMethod } = useRemove();

    return (
        <>
            <Modal.ModalHeader>Payment Methods</Modal.ModalHeader>

            <Modal.ModalBody>
                Please select a payment method below to modify.
            </Modal.ModalBody>

            <Dropdown
                options={[
                    ...user.paymentMethods.map((method) => ({
                        name: `${method.cardBrand} ${method.lastFour}`, value: method.id
                    })),
                    {
                        name: "Add Payment Method", value: null, onClick: () => {
                            closeModal();

                            createModal(<Modal.AddPaymentMethodModal />);
                        }
                    }
                ]}
                onPick={(value) => setSelectedPaymentMethod(user.paymentMethods.find((method) => method.id === value) ?? null)}
            >
                {selectedPaymentMethod ? <><i className="fas fa-credit-card" style={{ marginRight: "10px" }} /> {selectedPaymentMethod.cardBrand} {selectedPaymentMethod.lastFour}</> : "No Payment Method Selected"}
            </Dropdown>

            <Modal.ModalBody style={{ fontSize: "0.8rem" }}>
                We use Square to handle all of our payment processing.
                <br />
                None of your payment information is stored on our servers.
            </Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <GenericButton onClick={() => {
                    setLoading(true);

                    selectPaymentMethod(selectedPaymentMethod!.id)
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Select</GenericButton>
                <GenericButton onClick={() => {
                    setLoading(true);

                    removePaymentMethod(selectedPaymentMethod!.id)
                        .then(() => closeModal())
                        .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                        .finally(() => setLoading(false));
                }}>Remove</GenericButton>
                <GenericButton onClick={closeModal}>Cancel</GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
