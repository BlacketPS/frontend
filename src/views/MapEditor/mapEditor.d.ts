export enum Mode {
    EDIT = 1,
    CREATE = 2,
    DELETE = 3,
    SELECT = 4,
    PAINT_BUCKET = 5
}

export interface TileSet {
    id: string;
    x: number;
    y: number;
}

export interface ToolButtonProps {
    icon: string;
    onClick: () => void;
}
