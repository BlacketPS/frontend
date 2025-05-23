import { useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Button, Modal } from "@components/index";
import styles from "./billing.module.scss";

export default function SettingsBilling() {
    const { user } = useUser();
    if (!user) return null;

    const { createModal } = useModal();

    const [paymentMethodString, setPaymentMethodString] = useState<string | null>(null);

    useEffect(() => {
        const primaryPaymentMethod = user.paymentMethods.find((method) => method.primary);

        if (primaryPaymentMethod) {
            setPaymentMethodString(`${primaryPaymentMethod.cardBrand} ${primaryPaymentMethod.lastFour}`);
        } else {
            setPaymentMethodString(null);
        }
    }, [user]);

    return (
        <div className={styles.container}>
            <div className={styles.planContainer}>
                <div className={styles.planDetailsContainer}>
                    <img src={window.constructCDNUrl("/content/gem.png")} className={styles.planLogo} />

                    <div className={styles.planDetails}>
                        <div className={styles.planName}>
                            Blacket Basic
                        </div>

                        <div className={styles.planDescription}>
                            You are currently not subscribed to any plan.
                        </div>
                    </div>
                </div>

                <div className={styles.planActions}>
                    <Button.ClearButton
                    >
                        Cancel
                    </Button.ClearButton>

                    <Button.ClearButton
                    >
                        Switch Plans
                    </Button.ClearButton>
                </div>
            </div>

            <div className={styles.header}>
                Payments
            </div>

            <div className={styles.paymentsContainer}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>Billing Information</div>

                    <div>Your plan will automatically renew on 06/08/2025 and you will be charged $99.99</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>Payment Method</div>

                    <Button.ClearButton className={styles.paymentMethodButton} onClick={() => createModal(paymentMethodString ? <Modal.PaymentMethodsModal /> : <Modal.AddPaymentMethodModal />)}>
                        {paymentMethodString && <i className="fa-solid fa-credit-card" />}
                        {paymentMethodString ?? "Add Payment Method"}
                    </Button.ClearButton>
                </div>
            </div>

            <div className={styles.header}>
                Transaction History
            </div>
        </div>
    );
}


// const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<UserPaymentMethod | null>(user.paymentMethods.find((method) => method.primary) ?? null);

// const { createModal, closeModal } = useModal();
// const { selectPaymentMethod } = useSelect();
// const { removePaymentMethod } = useRemove();

// return (
//     <>
//         <Modal.ModalHeader>Payment Methods</Modal.ModalHeader>

//         <Modal.ModalBody>
//             Please select a payment method below to modify.
//         </Modal.ModalBody>

//         <Dropdown
//             options={[
//                 ...user.paymentMethods.map((method) => ({
//                     label: `${method.cardBrand} ${method.lastFour}`, value: method.id
//                 })),
//                 { label: "Add Payment Method", value: null }
//             ]}
//             onChange={(value: number | null) => {
//                 if (value === null) {
//                     closeModal();

//                     createModal(<Modal.AddPaymentMethodModal />);
//                 } else setSelectedPaymentMethod(user.paymentMethods.find((method) => method.id === value) ?? null);
//             }}
//         >
//             {selectedPaymentMethod ? `${selectedPaymentMethod.cardBrand} ${selectedPaymentMethod.lastFour}` : "Select a payment method..."}
//         </Dropdown>
