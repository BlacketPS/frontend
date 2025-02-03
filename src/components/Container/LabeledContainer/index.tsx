import { LabeledContainerProps } from "./labeledContainer";
import containerStyles from "../container.module.scss";
import styles from "./labeledContainer.module.scss";

export default function LabeledContainer({ icon, label, children, ...props }: LabeledContainerProps) {
    return (
        <div
            className={containerStyles.container}
            {...props}
        >
            <div className={styles.containerHeader}>
                <i className={icon} />
                <div>{label}</div>
            </div>

            <div className={styles.containerDivider} />

            {children}
        </div>
    )
}