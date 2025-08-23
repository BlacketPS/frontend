import Textfit from "react-textfit";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../billing.module.scss";

import { TransactionProps } from "../billing.d";
import { CurrencyTypeEnum, TransactionStatusEnum } from "@blacket/types";

export default function Transaction({ transaction, selected, ...props }: TransactionProps) {
    const { products } = useData();
    const { resourceIdToPath } = useResource();

    const product = products.find((p) => p.id === transaction.productId);
    if (!product) return null;

    const getCurrencyString = () => {
        switch (transaction.currency) {
            case CurrencyTypeEnum.USD:
                return <>${transaction.amount} USD</>;
            case CurrencyTypeEnum.CRYSTAL:
                return <>{transaction.amount}</>;
            default:
                return <>{transaction.amount} {transaction.currency}</>;
        }
    };

    const getStatusColor = () => {
        switch (transaction.status) {
            case TransactionStatusEnum.COMPLETED:
                return "green";
            case TransactionStatusEnum.PENDING:
                return "grey";
            case TransactionStatusEnum.FAILED:
                return "red";
            case TransactionStatusEnum.REFUNDED:
                return "orange";
            case TransactionStatusEnum.DISPUTED:
                return "black";
            default:
                return "grey";
        }
    };

    return (
        <div className={styles.transaction} {...props}>
            <Textfit className={styles.transactionDate} mode="single" min={0} max={16}>
                {new Date(transaction.createdAt).toLocaleDateString()}
            </Textfit>

            <div className={styles.transactionDescriptionContainer}>
                {window.innerWidth > 768 && <ImageOrVideo src={resourceIdToPath(product.imageId)} className={styles.transactionImage} />}

                <Textfit className={styles.transactionDescription} mode="single" min={0} max={16}>
                    {!product.isQuantityCapped ? `x${transaction.quantity} ` : ""}{product.name}
                </Textfit>
            </div>

            <div className={styles.transactionStatus} style={{
                backgroundColor: getStatusColor()
            }}>
                {window.innerWidth > 768 ? transaction.status : transaction.status.charAt(0)}
            </div>

            <div className={styles.transactionAmountContainer}>
                <Textfit className={styles.transactionAmount} mode="single" min={0} max={16}>
                    {getCurrencyString()}
                </Textfit>

                {transaction.currency === CurrencyTypeEnum.CRYSTAL && (
                    <img src={window.constructCDNUrl("/content/crystal.png")} className={styles.transactionAmountImage} />
                )}
            </div>

            <i className="fa-solid fa-chevron-down" />

            {selected && (
                <div className={styles.transactionDetails}>
                    {/*
                                 TODO: do this later
                                */}
                    todo later
                </div>
            )}
        </div>
    );
}
