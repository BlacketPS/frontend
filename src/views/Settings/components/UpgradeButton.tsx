import { useNavigate } from "react-router-dom";
import { Button } from "@components/index";
import styles from "../settings.module.scss";

import { UpgradeButtonProps } from "../settings.d";

export default function UpgradeButton({ children, onClick, ...props }: UpgradeButtonProps) {
    const navigate = useNavigate();

    return <Button.GenericButton className={styles.upgradeButton} onClick={() => {
        if (onClick) onClick();
        else navigate("/store");
    }} {...props}>{children}</Button.GenericButton>;
}
