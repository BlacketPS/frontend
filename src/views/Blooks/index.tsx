import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { usePack } from "@stores/PackStore/index";
import { useBlook } from "@stores/BlookStore/index";
import { Modal } from "@components/index";
import { BlooksHolder, SetHolder, Blook, RightBlook, RightButton, SellBlooksModal } from "./components";
import styles from "./blooks.module.scss";

import { Blook as BlookType, Pack } from "blacket-types";

export default function Blooks() {
    const { createModal } = useModal();
    const { user } = useUser();
    const { packs } = usePack();
    const { blooks } = useBlook();

    const [selectedBlook, setSelectedBlook] = useState<BlookType>(blooks[Math.floor(Math.random() * Object.keys(user.blooks).length)]);

    useEffect(() => {
        if (blooks.length < 1) createModal(<Modal.ErrorModal onClick={history.back}>This server has no blooks.</Modal.ErrorModal>);
    }, []);

    const nonPackBlooks = blooks.map((blook: BlookType) => !blook.packId);

    if (!user) return <Navigate to="/login" />;

    if (blooks.length > 1) return (
        <>
            <BlooksHolder>
                {packs.map((pack: Pack) => <SetHolder key={pack.id} name={`${pack.name} Pack`}>
                    {blooks.map((blook: BlookType) => blook.packId === pack.id && <Blook key={blook.id} blook={blook} locked={!user.blooks[blook.id]} quantity={user.blooks[blook.id]} onClick={() => setSelectedBlook(blook)} />)}
                </SetHolder>)}

                {
                    // Object.keys(user.blooks).filter((blook: number) => !blooks[blook!.packId]).length > 0 && <SetHolder name="Miscellaneous">
                    // if the user.blooks object has any id in nonPackBlooks
                    Object.keys(user.blooks).filter((blook: any) => nonPackBlooks.includes(blook)).length > 0 && <SetHolder name="Miscellaneous">
                        {
                            Object.keys(user.blooks).filter((blook: any) => nonPackBlooks.includes(blook)).map((blook: any) => <Blook key={blook} blook={blook} locked={!user.blooks[blook]} quantity={user.blooks[blook]} onClick={() => setSelectedBlook(blook)} />)
                        }
                    </SetHolder>
                }
            </BlooksHolder>

            {Object.keys(user.blooks).length > 0 && <RightBlook blook={selectedBlook} owned={user.blooks[selectedBlook.id]} noBlooksOwned={Object.keys(user.blooks).length < 1} />}

            {Object.keys(user.blooks).length > 0 && <div className={styles.rightButtonContainer}>
               <RightButton onClick={() => createModal(<SellBlooksModal blook={selectedBlook} />)}>Sell</RightButton>
            </div>}
        </>
    );
}
