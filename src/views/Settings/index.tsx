import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useLoading } from "@stores/LoadingStore";
import { useModal } from "@stores/ModalStore";
import { useSettings } from "@controllers/settings/useSettings/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { Modal, Button, Dropdown } from "@components/index";
import {
    SettingsContainer,
    PlanText,
    UpgradeButton,
    ChangeUsernameModal,
    ChangePasswordModal,
    EnableOTPModal,
    DisableOTPModal
} from "./components/index";
import styles from "./settings.module.scss";

import { SettingFriendRequestEnum } from "@blacket/types";

export default function Settings() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { changeSetting } = useSettings();
    const { user } = useUser();
    const { fontIdToName, titleIdToText } = useData();

    if (!user) return <Navigate to="/login" />;

    const [modalAnimation, setModalAnimation] = useState<boolean>(localStorage.getItem("DISABLE_MODAL_ANIMATION") ? false : true);

    const friendRequestsButton = () => {
        setLoading("Changing settings");
        changeSetting({
            key: "friendRequests",
            value: user.settings.friendRequests === SettingFriendRequestEnum.ON ? SettingFriendRequestEnum.MUTUAL : user.settings.friendRequests === SettingFriendRequestEnum.MUTUAL ? SettingFriendRequestEnum.OFF : user.settings.friendRequests === SettingFriendRequestEnum.OFF ? SettingFriendRequestEnum.ON : SettingFriendRequestEnum.ON
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

    return (
        <div className={styles.container}>
            <SettingsContainer header={{ icon: "fas fa-user", text: "Profile" }}>
                <div><b>ID:</b> {user.id}</div>
                <div><b>Username:</b> {user.username}</div>
                <div><b>Title:</b> {titleIdToText(user.titleId)}</div>
                <div style={{ display: "inline-flex" }}><b>Font: </b> <div style={{ fontFamily: fontIdToName(user.fontId), marginLeft: 7 }}>{fontIdToName(user.fontId)}</div></div>
                <div><b>Joined:</b> {`${new Date(user.createdAt).toLocaleDateString()} ${new Date(user.createdAt).toLocaleTimeString()}`}</div>
                {user.discord && <div><b>Discord:</b> {user.discord.username}</div>}

                <div className={styles.settingsContainerDivider} style={{ margin: "10px 0" }} />

                {!user.discord && <Button.ClearButton to={
                    `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURI(window.location.origin + window.location.pathname + "/link-discord")
                    }&scope=identify`
                }>Link Discord</Button.ClearButton>}
                <Button.ClearButton onClick={() => createModal(<Modal.LogoutModal />)}>Logout</Button.ClearButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-clipboard-list", text: "Plan" }}>
                <PlanText>Basic</PlanText>

                <UpgradeButton>Upgrade</UpgradeButton>

                <div className={styles.settingsContainerDivider} style={{ margin: "15px 0" }} />

                <div>
                    <b>Payment Method:</b> {user.paymentMethods.length > 0 ? <>
                        <i className="fas fa-credit-card" style={{ marginLeft: 5, marginRight: 3 }} /> {user.paymentMethods.find((method) => method.primary)?.cardBrand} {user.paymentMethods.find((method) => method.primary)?.lastFour}
                    </> : "None"}
                </div>
                <div style={{ marginTop: 5 }}>
                    {user.paymentMethods.length < 1 && <Button.ClearButton onClick={() => createModal(<Modal.AddPaymentMethodModal />)}>Add Payment Method</Button.ClearButton>}
                    {user.paymentMethods.length > 0 && <Button.ClearButton onClick={() => createModal(<Modal.PaymentMethodsModal />)}>Manage Payment Methods</Button.ClearButton>}
                </div>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-pencil-alt", text: "Edit Info" }}>
                <Button.ClearButton onClick={() => createModal(<ChangeUsernameModal />)}>Change Username</Button.ClearButton>
                <Button.ClearButton onClick={() => createModal(<ChangePasswordModal />)}>Change Password</Button.ClearButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-cog", text: "General" }}>
                <Button.ClearButton onClick={friendRequestsButton}>Friend Requests: {
                    user.settings.friendRequests === SettingFriendRequestEnum.ON ? "On" : user.settings.friendRequests === SettingFriendRequestEnum.OFF ? "Off" : user.settings.friendRequests === SettingFriendRequestEnum.MUTUAL ? "Mutual" : "Unknown"
                }</Button.ClearButton>
                <Button.ClearButton onClick={() => createModal(user.settings.otpEnabled ? <DisableOTPModal /> : <EnableOTPModal />)}>{user.settings.otpEnabled ? "Disable" : "Enable"} OTP / 2FA</Button.ClearButton>
            </SettingsContainer>

            <SettingsContainer header={{ icon: "fas fa-palette", text: "Theme" }}>
                <Tooltip id="modalAnimation" place="right">This will disable the zoom in out animation on popups.</Tooltip>
                <Button.ClearButton data-tooltip-id="modalAnimation" onClick={modalAnimationButton}>Modal Animation: {modalAnimation ? "On" : "Off"}</Button.ClearButton>
                <div>More options coming soon!</div>
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
                <Link to="/terms">Terms of Service</Link>
                <Link to="/privacy">Privacy Policy</Link>
            </SettingsContainer>
        </div>
    );
}
