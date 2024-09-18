import { Button } from "@components/index";
import styles from "../leaderboard.module.scss";

import { FilterButtonProps } from "../leaderboard.d";

export default function FilterButton({ mobile = false, children, ...props }: FilterButtonProps) {
    return <Button.ClearButton className={!mobile ? styles.filterButton : styles.mobileFilterButton} {...props}>Sort By: {children}</Button.ClearButton>;
}
