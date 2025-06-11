import { useResource } from "@stores/ResourceStore/index";
import { useContextMenu } from "@stores/ContextMenuStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { Button } from "@components/index";
import { AuctionModal } from ".";
import Textfit from "react-textfit";
import styles from "../inventory.module.scss";

import { RightItemProps } from "../inventory";
import { AuctionTypeEnum } from "@blacket/types";

export default function RightItem({ item, children, ...props }: RightItemProps) {
    const { resourceIdToPath } = useResource();
    const { openContextMenu } = useContextMenu();
    const { rarities } = useData();

    const { createModal } = useModal();

    const rarity = rarities.find((r) => r.id === (item.rarityId));
    if (!rarity) return null;

    return (
        <div className={styles.rightSide} {...props}>
            <div className={styles.rightSideContent}>
                <div className={styles.rightBlookBackground}>
                    <img src={window.constructCDNUrl("/content/blooks/backgrounds/Default.png")} alt="Item Background" draggable={false} />
                </div>

                <div className={styles.rightTopText}>
                    <Textfit mode="single" min={0} max={window.innerWidth > 1000 ? 40 : 25} className={styles.rightBlookName}>{item.name}</Textfit>
                    <div style={{
                        color: rarity.color
                    }} className={`${styles.rightBlookRarity} ${rarity.color === "rainbow" ? "rainbow" : ""}`}>{rarities.find((r) => r.id === item.rarityId)!.name}</div>
                </div>

                <div className={styles.rightItemImage}>
                    <img src={resourceIdToPath(item.imageId)} alt={item.name} />
                </div>

                <div className={styles.rightBottomText}>
                    <Textfit className={styles.rightBottomDescription} max={35} min={0} mode="multi">{item.description}</Textfit>
                </div>

                <Button.GenericButton
                    className={styles.rightButtonMobile}
                    backgroundColor="var(--primary-color)"
                    onClick={() => openContextMenu([
                        { label: "Use", image: window.constructCDNUrl("/content/use.png") },
                        ...(item.canAuction ? [{ label: "Auction", icon: "fas fa-building-columns", onClick: () => createModal(<AuctionModal type={AuctionTypeEnum.ITEM} item={item} />) }] : [])
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
