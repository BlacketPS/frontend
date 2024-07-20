import { useResource } from "@stores/ResourceStore/index";
import { useContextMenu } from "@stores/ContextMenuStore/index";
import { useData } from "@stores/DataStore/index";
import { Button } from "@components/index";
import Textfit from "react-textfit";
import styles from "../inventory.module.scss";

import { RightItemProps } from "../inventory";

export default function RightItem({ item, usesLeft, children, ...props }: RightItemProps) {
    const { resourceIdToPath } = useResource();
    const { openContextMenu, closeContextMenu } = useContextMenu();
    const { rarities } = useData();

    return (
        <div className={styles.rightSide} {...props}>
            <div className={styles.rightSideContent}>
                <div className={styles.rightBlookBackground}>
                    <img src={"https://cdn.blacket.org/static/content/blooks/backgrounds/Default.png"} alt="Blook Background" draggable={false} />
                </div>

                <div className={styles.rightTopText}>
                    <Textfit mode="single" min={0} max={window.innerWidth > 1000 ? 40 : 25} className={styles.rightBlookName}>{item.name}</Textfit>
                    <div style={{
                        color: rarities.find((r) => r.id === (item.rarityId))!.color
                    }} className={styles.rightBlookRarity}>{rarities.find((r) => r.id === item.rarityId)!.name}</div>
                </div>

                <div className={styles.rightItemImage}>
                    <img src={resourceIdToPath(item.imageId) || "https://cdn.blacket.org/static/content/blooks/Error.png"} alt={item.name} />
                </div>

                <div className={styles.rightBottomText}>
                    <Textfit className={styles.rightBottomDescription} max={35} min={0} mode="multi">{item.description}</Textfit>
                    {usesLeft?.toLocaleString() || 0} Uses Left
                </div>

                <Button.GenericButton
                    className={styles.rightButtonMobile}
                    backgroundColor="var(--primary-color)"
                    onClick={() => openContextMenu([
                        { label: "Use", image: "https://cdn.blacket.org/static/content/use.png" },
                        { label: "Auction", icon: "fas fa-building-columns" },
                        { label: "Close", icon: "fas fa-times", onClick: () => closeContextMenu() }
                    ])}
                >
                    <i className="fas fa-bars" />
                </Button.GenericButton>

                <div className={styles.rightShadow} />
            </div>

            {children}
        </div>
    );
}
