import { useEffect, useRef, useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useSettings } from "@controllers/settings/useSettings/index";
import styles from "../market.module.scss";
import { CategoryProps } from "../market.d";

export default function Category({ header, internalName, children }: CategoryProps) {
    const { user } = useUser();
    if (!user) return null;

    const { changeSetting } = useSettings();

    const contentRef = useRef<HTMLDivElement>(null);

    const [openedState, setOpenedState] = useState(user.settings.categoriesClosed.includes(internalName) ? false : true);
    const [isVisible, setIsVisible] = useState(openedState);

    if (!user) return null;

    const toggleOpenedState = () => {
        const newCategoriesClosed = openedState
            ? [...user.settings.categoriesClosed, internalName]
            : user.settings.categoriesClosed.filter((category) => category !== internalName);

        changeSetting({ key: "categoriesClosed", value: newCategoriesClosed })
            .then(() => setOpenedState(!openedState));
    };

    useEffect(() => {
        if (!contentRef.current) return;

        Object.assign(contentRef.current.style, { maxHeight: openedState ? `${contentRef.current.scrollHeight}px` : "0px" });

        setIsVisible(openedState);
    }, [openedState]);

    return (
        <>
            <div className={styles.categoryHeader} onClick={toggleOpenedState}>
                {header}
                <img
                    src={window.constructCDNUrl("/content/arrow.png")}
                    className={styles.categoryArrow}
                    draggable={false}
                    data-opened={isVisible && openedState}
                />
            </div>
            <div
                className={styles.categoryContent}
                data-opened={openedState}
                ref={contentRef}
                style={{
                    opacity: 1,
                    ...(isVisible ?
                        {
                            visibility: "visible"
                        } : {
                            visibility: "hidden"
                        })
                }}
            >
                {children}
            </div>
        </>
    );
}
