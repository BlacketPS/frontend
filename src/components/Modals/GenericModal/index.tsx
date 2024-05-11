import { GenericModalProps } from "./genericModal";
import { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";

import styles from "./genericModal.module.scss";

export default function GenericModal({ closing = false, noAnimation = false, children }: GenericModalProps) {
    const customStartStop: number[] = [550, 550];

    const modalPosition = useSpring({ y: 0 });
    const bindModal = useDrag((params) => {
        if (window.innerWidth > 600) return;
        const modalTop = (params.event?.currentTarget as Element)?.getBoundingClientRect().top;

        if (params.dragging) {
            if (params.movement[1] < -10 || (params.event as MouseEvent).clientY > modalTop + 60) return;
            modalPosition.y.set(params.movement[1]);
        } else {
            console.log(modalPosition.y.get());
            if (modalPosition.y.get() > 60) {
                closing = true;
            }
            modalPosition.y.start(0);
        }
    });

    useEffect(() => {
        if (!closing) {
            modalPosition.y.set(customStartStop && window.innerWidth <= 700 ? customStartStop[0] : window.innerWidth <= 700 ? 200 : 50);
            modalPosition.y.start(500);
        }
    }, [closed]);

    return (
        <animated.div data-closing={closing} data-animated={noAnimation ? false : true} style={{
            backgroundColor: modalPosition.y.to([200, 0], ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.6)"])
        }} className={styles.modal}>
            <animated.div onClick={(e) => e.stopPropagation()} {...bindModal()} data-closing={closing} data-animated={noAnimation ? false : true} style={{
                y: modalPosition.y,
                touchAction: "none",
                opacity: window.innerWidth > 600 ? modalPosition.y.to([150, 0], [0, 1]) : 1
        }} className={styles.content}>
                <div data-closing={closing} data-animated={noAnimation ? false : true} className={styles.container}>
                    {children}
                </div>
            </animated.div>
        </animated.div>
    );
}
