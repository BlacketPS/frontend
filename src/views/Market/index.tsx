import { Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore";
import { useUser } from "@stores/UserStore";
import { useModal } from "@stores/ModalStore";
import { usePack } from "@stores/PackStore/index";
import { useSettings } from "@controllers/settings/useSettings";
import { Modal, Button } from "@components/index";
import { OpenPackModal, Category, Pack } from "./components";
import styles from "./market.module.scss";

import { Pack as PackType } from "blacket-types";

export default function Market() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { packs } = usePack();

    const { changeSetting } = useSettings();

    const toggleInstantOpen = () => {
        setLoading("Changing settings");
        changeSetting({ key: "openPacksInstantly", value: !user.settings.openPacksInstantly })
            .then(() => setLoading(false))
            .catch(() => createModal(<Modal.ErrorModal>Failed to change settings.</Modal.ErrorModal>))
            .finally(() => setLoading(false));
    };

    const purchasePack = () => new Promise<void>((resolve, reject) => {
        resolve();
    });

    if (!user) return <Navigate to="/login" />;

    return (
        <>
            <div className={styles.buttonHolder}>
                <Button.LittleButton onClick={toggleInstantOpen}>Instant Open: {user.settings.openPacksInstantly ? "On" : "Off"}</Button.LittleButton>
            </div>

            <Category header={`Packs (${packs.length})`} internalName="MARKET_PACKS">
                <div className={styles.packsWrapper}>
                    {packs.map((pack: PackType) => <Pack key={pack.id} pack={pack} onClick={() => {
                        if (!user.settings.openPacksInstantly) createModal(<OpenPackModal
                            packId={pack.id}
                            userTokens={user.tokens}
                            onYesButton={() => purchasePack()} />
                        );
                        else purchasePack();
                    }} />)}
                </div>
            </Category>

            <Category header="Weekly Shop" internalName="MARKET_WEEKLY_SHOP">
                There are no items in the weekly shop.
            </Category>

            <Category header="Item Shop" internalName="MARKET_ITEM_SHOP">
                There are no items in the item shop.
            </Category>
        </>
    );
}
