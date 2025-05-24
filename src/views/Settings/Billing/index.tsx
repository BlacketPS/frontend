import { useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Button, Modal, Textfit } from "@components/index";
import styles from "./billing.module.scss";
import { Transaction } from "@blacket/types";

export default function SettingsBilling() {
    const { user } = useUser();
    if (!user) return null;

    const { createModal } = useModal();

    const [paymentMethodString, setPaymentMethodString] = useState<string | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
                    <img src={window.constructCDNUrl("/content/logo.png")} className={styles.planLogo} />

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

                    <div>Your plan will automatically renew on 06/08/2025 and you will be charged $99.99 USD</div>
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

            <div className={styles.transactionHistoryContainer}>
                <div className={styles.transactionHistoryTopRow}>
                    <div className={styles.transactionHistoryDate}>Date</div>
                    <div className={styles.transactionHistoryDescription}>Description</div>
                    <div className={styles.transactionHistoryAmount}>Amount</div>
                </div>

                <div className={styles.transactionHistory}>
                    <div className={styles.transaction} onClick={() => setSelectedTransaction(selectedTransaction ? null : {} as Transaction)}>
                        <Textfit className={styles.transactionDate} mode="single" min={0} max={16}>
                            06/08/2025
                        </Textfit>

                        <Textfit className={styles.transactionDescription} mode="single" min={0} max={16}>
                            Blacket Basic
                        </Textfit>

                        <Textfit className={styles.transactionAmount} mode="single" min={0} max={16}>
                            $99.99 USD
                        </Textfit>

                        <i className="fa-solid fa-chevron-down" />

                        {selectedTransaction && (
                            <div className={styles.transactionDetails}>
                                todo later
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
