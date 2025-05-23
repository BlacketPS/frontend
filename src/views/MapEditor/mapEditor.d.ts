import { Tile } from "@constants/tiles";

export enum Mode {
    EDIT = 1,
    CREATE = 2,
    DELETE = 3,
    SELECT = 4,
    FILL = 5
}

export interface TileSet {
    id: string;
    x: number;
    y: number;
}

export interface ToolButtonProps {
    name: string;
    icon: string;
    onClick: () => void;
}

export interface TileProps {
    tile: Tile;
    onClick: () => void;
}

export enum SnapMode {
    OFF = 0,
    ONE = 1,
    HALF = 2,
    QUARTER = 3,
    EIGHTH = 4
}
