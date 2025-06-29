import { HTMLAttributes } from "react";
import { UserItem } from "@blacket/types";

export interface InventoryItemProps extends HTMLAttributes<HTMLDivElement> {
    item: UserItem;
    selectable?: boolean;
    useVhStyles?: boolean;
}
