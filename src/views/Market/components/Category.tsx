import { useEffect, useRef, useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useSettings } from "@controllers/settings/useSettings/index";
import styles from "../market.module.scss";
import { CategoryProps } from "../market.d";

export default function Category({ header, internalName, children }: CategoryProps) {
    const { user } = useUser();
    const { changeSetting } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);

    const [openedState, setOpenedState] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [maxHeightSet, setMaxHeightSet] = useState(false);
    const [empty, setEmpty] = useState(false);

    if (!user) return null;

    const toggleOpenedState = () => {
        const newCategoriesClosed = openedState
            ? [...user.settings.categoriesClosed, internalName]
            : user.settings.categoriesClosed.filter((category) => category !== internalName);

        changeSetting({ key: "categoriesClosed", value: newCategoriesClosed })
            .then(() => setOpenedState(!openedState));
    };

    useEffect(() => {
        if (!contentRef.current || maxHeightSet) return;

        const height = contentRef.current.getBoundingClientRect().height;
        const open = !user.settings.categoriesClosed.includes(internalName);

        if (height > 0) {
            contentRef.current.style.setProperty("--max-height", `${height}px`);
            setOpenedState(open);
            setMaxHeightSet(true);
            setIsVisible(true);
        }

        return () => {
            if (contentRef.current) {
                contentRef.current.removeEventListener("transitionend", () => setMaxHeightSet(true));
            }
        };
    }, [contentRef, maxHeightSet]);

    useEffect(() => {
        if (contentRef.current) {
            const isEmptyContent = contentRef.current.children.length === 0 || contentRef.current.children[0].children.length === 0;
            setEmpty(isEmptyContent);
        }
    }, [contentRef]);

    useEffect(() => {
        if (contentRef.current) {
            Object.assign(contentRef.current.style, {
                maxHeight: openedState ? `${contentRef.current.scrollHeight}px` : "0px"
            });
            setIsVisible(openedState);
        }
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
