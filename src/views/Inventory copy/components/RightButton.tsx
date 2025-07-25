import { Button } from "@components/index";
import styles from "../inventory.module.scss";

import { RightButtonProps } from "../inventory.d";

export default function RightButton({ children, image, ...props }: RightButtonProps) {
    return (
        <Button.GenericButton backgroundColor="var(--primary-color)" className={styles.rightButton} {...props}>
            <div className={styles.rightButtonInside}>
                {image && <img src={image} />}
                {children}
            </div>
        </Button.GenericButton>
    );
}
