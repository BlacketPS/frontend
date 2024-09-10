import { useState } from "react";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
// import { useChangeColor } from "@controllers/cosmetics/useChangeColor/index";
import { ColorPicker } from "@components/index";
import styles from "../cosmeticsModal.module.scss";

export default function ColorCategory() {

    const { setLoading } = useLoading();
    const { user } = useUser();

    // const { changeFont } = useChangeFont();

    if (!user) return null;

    const onSelect = (id: number) => {
        setLoading(true);

        /* changeFont({ fontId: id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false)); */
    };

    return (
        <>

            <div className={styles.holder} data-column={true}>
                <div className={styles.colorCategoryHolder}>
                    <ColorPicker
                        initialColor="#000000"
                        onPick={(color) => console.log(color)}
                    />
                </div>
            </div>
        </>
    );
}
