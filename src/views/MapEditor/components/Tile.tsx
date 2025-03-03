import { Tooltip } from "react-tooltip";
import styles from "../mapEditor.module.scss";

import { TileProps } from "../mapEditor";

export default function Tile({ tile, onClick }: TileProps) {
    return (
        <>
            <Tooltip id={tile.id} place="right">{tile.id}</Tooltip>

            <div className={styles.tile} onClick={onClick} data-tooltip-id={tile.id}>
                <img src={tile.image} alt={tile.id} />
            </div>
        </>
    );
}
