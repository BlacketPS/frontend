import { Fragment } from "react";
import { Tooltip } from "react-tooltip";
import styles from "./searchBox.module.scss";

import { SearchBoxProps } from "./searchBox.d";

export default function SearchBox({ noPadding, buttons, containerProps, ...props }: SearchBoxProps) {
    return (
        <div className={styles.searchBoxHolder} data-no-padding={noPadding} {...containerProps}>
            <div className={styles.searchContainer}>
                <input className={styles.searchInput} {...props} />
                <div className={styles.searchButtonHolder}>
                    {buttons && buttons.map((button, i) => (
                        <Fragment key={i}>
                            <i className={`${styles.searchButton} ${button.icon}`} onClick={button.onClick} data-tooltip-id={`searchButton-${i}`} />

                            <Tooltip id={`searchButton-${i}`} place="top">{button.tooltip}</Tooltip>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
