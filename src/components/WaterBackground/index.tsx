import { forwardRef } from "react";
import styles from "./waterBackground.module.scss";

import { WaterBackgroundProps } from "./waterBackground.d";

export default forwardRef<HTMLDivElement, WaterBackgroundProps>(({ style, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={styles.background}
            style={{
                backgroundImage: `url("${window.constructCDNUrl("/content/trading-plaza/water.gif")}")`,
                ...style
            }}
            {...props}
        />
    );
});
