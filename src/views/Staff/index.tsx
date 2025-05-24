import { Container } from "@components/index";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import styles from "./staff.module.scss";

import { PermissionTypeEnum } from "@blacket/types";

export default function StaffPanel() {
    const navigate = useNavigate();

    const { user } = useUser();
    if (!user || !user.hasPermission(PermissionTypeEnum.VIEW_AUDIT)) return <Navigate to="/login" />;

    return (
        <div className={styles.panelContainer}>
        </div>
    );
}
