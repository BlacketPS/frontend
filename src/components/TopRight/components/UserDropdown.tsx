import { Link } from "react-router-dom";
import { useModal } from "@stores/ModalStore/index";
import { Modal } from "@components/index";
import getAvatarURL from "@functions/resources/useGetAvatarURL";
import useFontIdToName from "@functions/resources/useFontIdToName";
import styles from "../topRight.module.scss";

import { UserDropdownProps } from "../topRight.d";

export default function UserDropdown({ user }: UserDropdownProps) {
    const { createModal } = useModal();

    const fontName = useFontIdToName(user.fontId);

    return (
        <div className={styles.userContainer}>
            <div className={styles.userLeft}>
                <img src={getAvatarURL(user)} draggable={false} />

                <div className={
                    user.color === "rainbow" ? "rainbow" : ""
                } style={{
                    color: user.color,
                    fontFamily: fontName
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
