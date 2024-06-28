import { InputProps } from "./input.d";
import styles from "./input.module.scss";


export default function Input({ icon, containerProps, ...props }: InputProps) {
    return (
        <div className={styles.inputContainer} {...containerProps}>
            {icon && <i className={icon} />}
            <input data-icon={icon ? true : false} {...props} />
        </div>
    );
}
