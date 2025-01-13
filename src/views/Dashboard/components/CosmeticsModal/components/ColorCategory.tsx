import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useLoading } from "@stores/LoadingStore/index";
import { Button, ColorPicker, Username } from "@components/index";
import { useChangeColor } from "@controllers/cosmetics/useChangeColor/index";
import styles from "../cosmeticsModal.module.scss";

import { PermissionTypeEnum } from "@blacket/types";

const disabledStyles: CSSProperties = {
    opacity: 0.5,
    pointerEvents: "none"
};

export default function ColorCategory() {
    const { user } = useUser();
    if (!user) return null;

    const [color, setColor] = useState<string>(user.color);

    const { closeModal } = useModal();
    const { setLoading } = useLoading();

    const { changeColorTier1 } = useChangeColor();

    const navigate = useNavigate();

    return (
        <div className={styles.holder} data-column={true}>
            <div className={styles.colorCategoryHolder}>
                <div>Enter a hexadecimal color:</div>

                <ColorPicker
                    initialColor={[color, setColor]}
                    onPick={(c) => setColor(c)}
                />

                <div className={styles.usernameWouldLookLike}>Your username would look like: <Username style={{ marginLeft: 5 }} user={{ ...user, color }} /></div>


                <Button.GenericButton
                    onClick={() => {
                        setLoading(true);

                        changeColorTier1({ color })
                            .then(() => closeModal())
                            .finally(() => setLoading(false));
                    }}
                    style={{
                        ...(!user.permissions.includes(PermissionTypeEnum.CHANGE_NAME_COLOR_TIER_1) ? disabledStyles : {}),
                        marginTop: 15
                    }}
                >
                    Save
                </Button.GenericButton>

                {!user.permissions.includes(PermissionTypeEnum.CHANGE_NAME_COLOR_TIER_1) && (
                    <div style={{ marginTop: 15 }}>
                        <div>Your current plan doesn't support changing your color.</div>

                        <Button.GenericButton
                            onClick={() => {
                                closeModal();

                                navigate("/store");
                            }}
                            style={{ marginTop: 15 }}
                        >
                            Upgrade Plan
                        </Button.GenericButton>
                    </div>
                )}
            </div>
        </div>
    );
}
