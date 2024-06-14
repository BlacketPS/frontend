import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useLoading } from "@stores/LoadingStore";
import { useModal } from "@stores/ModalStore";
import { useSettings } from "@controllers/settings/useSettings/index";
import { useUser } from "@stores/UserStore";
import { Modal, Button } from "@components/index";
import {
    SettingsContainer,
    PlanText,
    UpgradeButton,
    ChangeUsernameModal,
    ChangePasswordModal,
    EnableOTPModal,
    DisableOTPModal
} from "./components/index";
import useTitleIdToText from "@functions/resources/useTitleIdToText";
import useFontIdToName from "@functions/resources/useFontIdToName";
import styles from "./settings.module.scss";

import { SettingFriendRequest } from "blacket-types";

export default function Settings() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { changeSetting } = useSettings();
    const { user } = useUser();

    const [modalAnimation, setModalAnimation] = useState<boolean>(localStorage.getItem("DISABLE_MODAL_ANIMATION") ? false : true);

    const friendRequestsButton = () => {
        setLoading("Changing settings");
        changeSetting({
            key: "friendRequests",
            value: user.settings.friendRequests === SettingFriendRequest.ON ? SettingFriendRequest.MUTUAL : user.settings.friendRequests === SettingFriendRequest.MUTUAL ? SettingFriendRequest.OFF : user.settings.friendRequests === SettingFriendRequest.OFF ? SettingFriendRequest.ON : SettingFriendRequest.ON
        })
            .then(() => setLoading(false))
            .catch(() => createModal(<Modal.ErrorModal>Failed to change settings.</Modal.ErrorModal>))
            .finally(() => setLoading(false));
    };

    const modalAnimationButton = () => {
        if (localStorage.getItem("DISABLE_MODAL_ANIMATION")) {
            localStorage.removeItem("DISABLE_MODAL_ANIMATION");
            setModalAnimation(true);
        } else {
            localStorage.setItem("DISABLE_MODAL_ANIMATION", "true");
            setModalAnimation(false);
        }
    };

    const titleText = useTitleIdToText(user?.titleId);
    const fontName = useFontIdToName(user?.fontId);

    if (!user) return <Navigate to="/login" />;

    return (
        <div className={styles.container}>
            <SettingsContainer header={{ icon: "fas fa-user", text: "Profile" }}>
                <div><b>ID:</b> {user.id}</div>
                <div><b>Username:</b> {user.username}</div>
                <div><b>Title:</b> {titleText}</div>
                <div style={{ display: "inline-flex" }}><b>Font: </b> <div style={{ fontFamily: fontName, marginLeft: 7 }}>{fontName}</div></div>
                <div><b>Joined:</b> {`${new Date(user.createdAt).toLocaleDateString()} ${new Date(user.createdAt).toLocaleTimeString()}`}</div>

                <Button.ClearButton to={
                    `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURI(window.location.origin + window.location.pathname + "/link-discord")
                    }&scope=identify`
                }>Link Discord</Button.ClearButton>
                <Button.ClearButton onClick={() => createModal(<Modal.LogoutModal />)}>Logout</Button.ClearButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-clipboard-list", text: "Plan" }}>
                <PlanText>Basic</PlanText>

                <UpgradeButton>Upgrade</UpgradeButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-pencil-alt", text: "Edit Info" }}>
                <Button.ClearButton onClick={() => createModal(<ChangeUsernameModal />)}>Change Username</Button.ClearButton>
                <Button.ClearButton onClick={() => createModal(<ChangePasswordModal />)}>Change Password</Button.ClearButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-cog", text: "General" }}>
                <Button.ClearButton onClick={friendRequestsButton}>Friend Requests: {
                    user.settings.friendRequests === 1 ? "On" : user.settings.friendRequests === 2 ? "Off" : user.settings.friendRequests === 3 ? "Mutual" : "Unknown"
                }</Button.ClearButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-palette", text: "Theme" }}>
                <Tooltip id="modalAnimation" place="right">This will disable the zoom in out animation on popups.</Tooltip>
                <Button.ClearButton data-tooltip-id="modalAnimation" onClick={modalAnimationButton}>Modal Animation: {modalAnimation ? "On" : "Off"}</Button.ClearButton>

                {
                    /* <Button.ClearButton onClick={() => {
                    const style = document.createElement("style");
                    style.id = "theme";
                    style.innerHTML = `:root {
                        --background-opacity: 0.0175;
                        --background-color: #000000;
                        --primary-color: #0b0b0b;
                        --secondary-color: #1b1b1b;
                        --accent-color: #ffffff;
                    }`;
                    document.body.appendChild(style);
                }}>
                    amoled theme (experimental)
                </Button.ClearButton>
                <Button.ClearButton onClick={() => {
                    const style = document.getElementById("theme");
                    if (style) style.remove();
                }}>
                    revert to default theme
                </Button.ClearButton>
            */ }

            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-lock", text: "Privacy" }}>
                <Button.ClearButton onClick={() => createModal(user.settings.otpEnabled ? <DisableOTPModal /> : <EnableOTPModal />)}>{user.settings.otpEnabled ? "Disable" : "Enable"} OTP / 2FA</Button.ClearButton>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/privacy">Privacy Policy</Link>
            </SettingsContainer>
        </div>
    );
}
