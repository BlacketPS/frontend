import { forwardRef, ForwardedRef } from "react";
import styles from "../contextMenu.module.scss";

import { ContainerProps } from "../contextMenu.d";

const Container = forwardRef(({ top, left, children }: ContainerProps, ref: ForwardedRef<HTMLDivElement>) => (
    <>
        <div className={styles.mobileModal} />
        <div ref={ref} className={styles.container} style={{ top, left }} onContextMenu={(e) => e.preventDefault()}>{children}</div>
    </>
));

export default Container;
