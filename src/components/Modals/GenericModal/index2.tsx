import styles from "@styles/dashboard/main.module.scss";
import { createPortal } from "react-dom";
import { useEffect } from "react";

import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";

type ModalProps = {
    children: any;
    props?: any;
    decline: any;
    colorless?: boolean;
    customStartStop?: number[];
};

export default function Modal({ children, decline, customStartStop, colorless, ...props }: ModalProps): JSX.Element {
    function destroyModalGraciously() {
        modalPosition.y.start(window.innerWidth <= 700 ? (customStartStop ? customStartStop[1] : 300) : 300);
        setTimeout(() => decline(), 250);
    }

    const modalPosition = useSpring({ y: 0 });
    const bindModal = useDrag((params) => {
        if (window.innerWidth > 700) return;
        const modalTop = (params.event?.currentTarget as Element)?.getBoundingClientRect().top;

        if (params.dragging) {
            if (params.movement[1] < -10 || (params.event as MouseEvent).clientY > modalTop + 60) return;
            modalPosition.y.set(params.movement[1]);
        } else {
            if (modalPosition.y.get() > 60) return destroyModalGraciously();
            modalPosition.y.start(0);
        }
    });

    useEffect(() => {
        modalPosition.y.set(customStartStop && window.innerWidth <= 700 ? customStartStop[0] : window.innerWidth <= 700 ? 200 : 50);
        modalPosition.y.start(0);
    }, []);

    return createPortal(<animated.div onClick={() => destroyModalGraciously()} style={{
        backgroundColor: modalPosition.y.to([200, 0], ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.6)"]),
    }} className={styles.modal}>
        <animated.div onClick={(e) => e.stopPropagation()} {...bindModal()} {...props} style={{
            y: modalPosition.y,
            touchAction: "none",
            opacity: window.innerWidth > 700 ? modalPosition.y.to([150, 0], [0, 1]) : 1,
            backgroundColor: colorless ? "#f0eeee" : ""
        }} className={styles.modalContainer}>
            {/* mobile handle which only renders on inital modal load */}
            { window.innerWidth <= 700 && <div className={styles.mobileHandle} /> }
            {/* build your modal here */}
            {children}
        </animated.div>
    </animated.div>, document.body);
}
