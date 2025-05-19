import { Button } from "@components/index";
import styles from "../home.module.scss";

import { HeroButtonProps } from "../home";

export default function HeroButton({ to, mobileOnly, children }: HeroButtonProps) {
    if (mobileOnly && window.innerWidth > 768) return null;

    return (
        <Button.GenericButton
            backgroundColor="var(--primary-color)"
            className={styles.heroButton}
            to={to}
        >
            {children}
        </Button.GenericButton>
    );
}
