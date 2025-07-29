import { Fragment } from "react/jsx-runtime";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import { InventoryBlook, InventoryItem } from "./components";
import styles from "./itemContainer.module.scss";

import { ItemContainerOptions, ItemContainerProps, SelectedTypeEnum } from "./itemContainer.d";
import { Blook, Pack } from "@blacket/types";

const DEFAULT_OPTIONS: ItemContainerOptions = {
    showItems: true,
    showBlooks: true,
    showShiny: true,
    showLocked: true,
    showPacks: true,

    rarities: undefined,
    searchQuery: undefined
};

export default function ItemContainer({ user, options, onClick, ...props }: ItemContainerProps) {
    const { packs, items, blooks } = useData();
    const { resourceIdToPath } = useResource();
    const { getBlookAmount } = useUser();

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const nonPackBlooks = blooks.filter((blook) => !blook.packId);

    const isBlookVisible = (blook: Blook) => {
        const amountNormal = getBlookAmount(blook.id, false, user);
        const amountShiny = getBlookAmount(blook.id, true, user);
        const locked = amountNormal <= 0;

        if (mergedOptions.rarities && !mergedOptions.rarities.includes(blook.rarityId)) return false;
        if (mergedOptions.searchQuery && !blook.name.toLowerCase().includes(mergedOptions.searchQuery.toLowerCase())) return false;

        if (!locked || (locked && mergedOptions.showLocked)) return true;
        if (amountShiny > 0 && mergedOptions.showShiny) return true;

        return false;
    };

    const shouldRenderPack = (pack: Pack) => {
        const packBlooks = blooks.filter((b) => b.packId === pack.id);

        return packBlooks.some(isBlookVisible);
    };

    const renderBlookSet = (pack: Pack) => {
        return blooks
            .filter((b) => b.packId === pack.id)

            // filter to specific rarity if defined
            .filter((b) => !mergedOptions.rarities || mergedOptions.rarities.includes(b.rarityId))

            .sort((a, b) => a.priority - b.priority)
            .map((blook, key) => {
                const amountNormal = getBlookAmount(blook.id, false, user);
                const amountShiny = getBlookAmount(blook.id, true, user);

                const locked = amountNormal <= 0;

                const visible = isBlookVisible(blook);

                return (<Fragment key={key}>
                    {!(locked && !mergedOptions.showLocked) &&
                        <InventoryBlook
                            blook={blook}
                            shiny={false}
                            big={blook.isBig}
                            locked={locked}
                            amount={amountNormal}
                            onClick={() => {
                                if (amountNormal <= 0) return;

                                if (onClick) onClick({
                                    type: SelectedTypeEnum.BLOOK,
                                    item: user.blooks.find((ub) => ub.blookId === blook.id && !ub.shiny) || null
                                });
                            }}
                            style={{ display: visible ? undefined : "none" }}
                        />
                    }

                    {(amountShiny > 0 && mergedOptions.showShiny) &&
                        <InventoryBlook
                            blook={blook}
                            shiny={true}
                            big={blook.isBig}
                            locked={false}
                            amount={amountShiny}
                            onClick={() => {
                                if (amountShiny <= 0) return;

                                if (onClick) onClick({
                                    type: SelectedTypeEnum.BLOOK,
                                    item: user.blooks.find((ub) => ub.blookId === blook.id && ub.shiny) || null
                                });
                            }}
                            style={{ display: visible ? undefined : "none" }}
                        />
                    }
                </Fragment>);
            });
    };

    // main rendering
    return (
        <div className={`${props.className || ""} ${styles.itemsContainer}`}>
            {mergedOptions.showBlooks
                ? mergedOptions.showPacks
                    ? packs.map((pack) => (
                        <div
                            className={styles.setContainer}
                            style={{ display: shouldRenderPack(pack) ? undefined : "none" }}
                        >
                            <div className={styles.setTopContainer}>
                                <div
                                    className={styles.setTopTile}
                                    style={{
                                        backgroundImage: `url(${pack.iconId ? resourceIdToPath(pack.iconId) : window.constructCDNUrl("/content/packs/icons/DefaultTiled.png")})`
                                    }}
                                />

                                <div className={styles.setTopText}>
                                    {pack.name} Pack

                                    <div className={styles.setGradient} />
                                </div>

                            </div>

                            <div className={styles.setDivider} />

                            <div className={styles.setContent}>
                                {renderBlookSet(pack)}
                            </div>
                        </div>
                    ))
                    : <div className={styles.setContent}>
                        {packs.map((pack) => renderBlookSet(pack))}
                    </div>
                : null}
        </div>
    );
}
