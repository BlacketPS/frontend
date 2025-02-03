export interface Tile {
    id: string;
    image: HTMLImageElement | string;
    chance: number;
    flippable?: boolean;
}
