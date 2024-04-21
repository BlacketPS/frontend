import { InputProps } from "./input.d";
import styles from "./input.module.scss";

export default function Input({ icon, ...props }: InputProps) {
    return (
        <div className={styles.inputContainer}>
            {icon && <i className={icon} />}
            <input data-icon={icon ? true : false} {...props} />
        </div>
    );
}
