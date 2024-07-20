import { Link } from "react-router-dom";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { ImageOrVideo, Modal } from "@components/index";
import styles from "../topRight.module.scss";

import { UserDropdownProps } from "../topRight.d";

export default function UserDropdown({ user }: UserDropdownProps) {
    const { createModal } = useModal();
    const { getUserAvatarPath } = useUser();
    const { fontIdToName } = useData();

    return (
        <div className={styles.userContainer}>
            <div className={styles.userLeft}>
                <ImageOrVideo src={getUserAvatarPath(user)} draggable={false} />

                <div className={
                    user.color === "rainbow" ? "rainbow" : ""
                } style={{
                    color: user.color,
                    fontFamily: fontIdToName(user.fontId)
                }}>{user.username}</div>
            </div>

            <i className={`${styles.userDropdownIcon} fas fa-angle-down`} />

            <div className={styles.userDropdown}>
                <Link to="/settings">
                    <i className="fas fa-cog" /> Settings
                </Link>

                <Link to="/login" onClick={(e) => {
                    e.preventDefault();

                    createModal(<Modal.LogoutModal />);
                }}>
                    <i className="fas fa-sign-out-alt" /> Logout
                </Link>
            </div>
        </div>
    );
}
