import { useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useSettings } from "@controllers/settings/useSettings";
import styles from "../market.module.scss";

import { CategoryProps } from "../market.d";

export default function Category({ header, internalName, children }: CategoryProps) {
    const { user } = useUser();

    const [openedState, setOpenedState] = useState(user.settings.categoriesClosed.includes(internalName) ? false : true);

    const { changeSetting } = useSettings();

    const toggleOpenedState = () => changeSetting({
        key: "categoriesClosed", value: !openedState
            ? user.settings.categoriesClosed.filter((category: string) => category !== internalName)
            : [...user.settings.categoriesClosed, internalName]
    })
        .then(() => setOpenedState(!openedState));

    return (
        <>
            <div className={styles.categoryHeader} onClick={toggleOpenedState}>
                {header}
                <img src="https://cdn.blacket.org/static/content/arrow.png" className={styles.categoryArrow} draggable={false} data-opened={openedState} />
            </div>

            <div className={styles.categoryContent} data-opened={openedState}>{children}</div>
        </>
    );
}
