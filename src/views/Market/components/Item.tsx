import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";

import { ItemProps } from "../market.d";
import { ItemShopItemTypeEnum } from "@blacket/types";

export default function Item({ itemShop, onClick }: ItemProps) {
    const { items, blooks, banners, titles, fonts } = useData();
    const { resourceIdToPath } = useResource();
    const { user } = useUser();

    if (!user) return null;

    let normalItem;
    let textItem;

    switch (itemShop.type) {
        case ItemShopItemTypeEnum.ITEM:
            normalItem = items.find((item) => item.id === itemShop.itemId);
            break;
        case ItemShopItemTypeEnum.BLOOK:
            normalItem = blooks.find((blook) => blook.id === itemShop.blookId);
            break;
        case ItemShopItemTypeEnum.BANNER:
            normalItem = banners.find((banner) => banner.id === itemShop.bannerId);
            break;
        case ItemShopItemTypeEnum.TITLE:
            textItem = titles.find((title) => title.id === itemShop.titleId);
            break;
        case ItemShopItemTypeEnum.FONT:
            textItem = fonts.find((font) => font.id === itemShop.fontId);
            break;
    }

    if (!normalItem && !textItem) return null;

    const ITEM_NAME = normalItem?.name || textItem?.name;

    return (
        <div
            className={styles.itemContainer}
            onClick={onClick}
        >
            <div className={styles.itemName}>
                {itemShop.type === ItemShopItemTypeEnum.TITLE
                    ? "Title"
                    : itemShop.type === ItemShopItemTypeEnum.FONT
                        ? "Font"
                        : ITEM_NAME
                }
            </div>

            {normalItem
                ? <ImageOrVideo className={styles.itemImage} src={resourceIdToPath(normalItem.imageId)} />
                : <div
                    className={styles.itemText}
                    style={{ fontFamily: itemShop.type === ItemShopItemTypeEnum.FONT ? ITEM_NAME : undefined }}
                >
                    {ITEM_NAME}
                </div>
            }

            <div className={styles.bottomLeftText}>
                <img src={window.constructCDNUrl("/content/token.png")} alt="Token Icon" />
                {itemShop.price.toLocaleString()}
            </div>
        </div>
    );
}
