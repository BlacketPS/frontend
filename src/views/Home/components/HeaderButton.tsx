import { Button } from "@components/index";
import styles from "../home.module.scss";

import { HeaderButtonProps } from "../home.d";

export default function HeaderButton({ icon, to, scrolled, children }: HeaderButtonProps) {
    return (
        <Button.GenericButton
            backgroundColor={`var(--${scrolled ? "tertiary" : "primary"}-color)`}
            className={styles.headerButton}
            to={to}
            icon={icon}
        >
            {children}
        </Button.GenericButton>
    );
}
