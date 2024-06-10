import { Button } from "@components/index";
import styles from "../inventory.module.scss";

import { RightButtonProps } from "../inventory";

export default function RightButton({ children, ...props }: RightButtonProps) {
    return (
        <Button.GenericButton backgroundColor="var(--primary-color)" className={styles.rightButton} {...props}>
            <div className={styles.rightButtonInside}>
                <img src="https://cdn.blacket.org/static/content/token.png" />
                {children}
            </div>
        </Button.GenericButton>
    );
}
