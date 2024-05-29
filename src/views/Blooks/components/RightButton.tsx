import { Button } from "@components/index";
import styles from "../blooks.module.scss";

import { RightButtonProps } from "../blooks.d";

export default function RightButton({ children, ...props }: RightButtonProps) {
    return (
        <Button.GenericButton backgroundColor="var(--primary-color)" className={styles.rightButton} {...props}>
            <div className={styles.rightButtonInside}>
                <img src="/content/token.png" />
                {children}
            </div>
        </Button.GenericButton>
    );
}
