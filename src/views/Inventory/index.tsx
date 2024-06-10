import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { usePack } from "@stores/PackStore/index";
import { useBlook } from "@stores/BlookStore/index";
import { BlooksHolder, SetHolder, Blook, RightBlook, RightButton, SellBlooksModal } from "./components";
import styles from "./inventory.module.scss";

import { Blook as BlookType, Pack } from "blacket-types";

export default function Inventory() {
    const { createModal } = useModal();
    const { user } = useUser();
    const { packs } = usePack();
    const { blooks } = useBlook();

    // i have to make a const for this i have no idea why but if i don't it just sometimes can't find a blook theres 0 reason for it but using a const works! i love typescript
    const randomBlookIdFromMyBlooks = Object.keys(user.blooks)[Math.floor(Math.random() * Object.keys(user.blooks).length)];
    const [selectedBlook, setSelectedBlook] = useState<BlookType | null>(blooks.find((blook) => blook.id === parseInt(randomBlookIdFromMyBlooks)) || null);

    const nonPackBlooks = blooks.filter((blook) => !blook.packId).map((blook) => blook.id);

    const selectBlook = (blook: BlookType) => {
        if (!user.blooks[blook.id]) return;

        setSelectedBlook(blook);
    };

    if (!user) return <Navigate to="/login" />;

    return (
        <>
            <BlooksHolder>
                {packs.map((pack: Pack) => <SetHolder key={pack.id} name={`${pack.name} Pack`} nothing={blooks.filter((blook) => blook.packId === pack.id).length === 0}>
                    {blooks.filter((blook) => blook.packId === pack.id).length > 0 ?
                        blooks.sort((a, b) => a.priority - b.priority).map((blook) => blook.packId === pack.id && <Blook key={blook.id} blook={blook} locked={!user.blooks[blook.id]} quantity={user.blooks[blook.id]} onClick={() => selectBlook(blook)} />)
                        : <div className={styles.noBlooks}>There are no blooks in this pack.</div>}
                </SetHolder>)}

                {Object.keys(user.blooks).filter((blook) => nonPackBlooks.includes(parseInt(blook))).length !== 0 && <SetHolder nothing={false} name="Miscellaneous">
                    {nonPackBlooks.map((blook) => user.blooks[blook] && <Blook key={blook} blook={blooks.find((b) => b.id === blook)!} locked={!user.blooks[blook]} quantity={user.blooks[blook]} onClick={() => selectBlook(blooks.find((b) => b.id === blook)!)} />)}
                </SetHolder>}
            </BlooksHolder>

            {Object.keys(user.blooks).length > 0 && selectedBlook && <RightBlook blook={selectedBlook} owned={user.blooks[selectedBlook.id]} noBlooksOwned={Object.keys(user.blooks).length < 1}>
                {Object.keys(user.blooks).length > 0 && selectedBlook && <div className={styles.rightButtonContainer}>
                    <RightButton onClick={() => createModal(<SellBlooksModal blook={selectedBlook} />)}>Sell</RightButton>
                </div>}
            </RightBlook>}
        </>
    );
}
