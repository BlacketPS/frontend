import { forwardRef } from "react";
import styles from "./input.module.scss";

import { InputProps } from "./input.d";

const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, containerProps, ...props }, ref) => <div className={styles.inputContainer} {...containerProps}>
    {icon && <i className={icon} />}
    <input data-icon={icon ? true : false} ref={ref} {...props} />
</div>);

export default Input;