import { Link } from "react-router-dom";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { Blook, ImageOrVideo, Modal, Username } from "@components/index";
import styles from "../topRight.module.scss";

import { UserDropdownProps } from "../topRight.d";

export default function UserDropdown({ user }: UserDropdownProps) {
    const { createModal } = useModal();
    const { getUserAvatarPath } = useUser();

    return (
        <div className={styles.userContainer}>
            <div className={styles.userLeft}>
                <div className={styles.userLeftAvatar}>
                    <Blook
                        src={getUserAvatarPath(user)}
                        shiny={user.avatar?.shiny}
                        draggable={false}
                    />
                </div>

                <Username user={user} />
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
