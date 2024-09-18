import { PublicUser } from "blacket-types";

export interface Tile {
    id: string;
    image: string;
    chance: number;
    flippable?: boolean;
}

export enum EntityType {
    PLAYER = 1,
    SPAWN = 2,
    TRADING_TABLE = 3
}

export interface Entity {
    id: string;
    type: EntityType;
    x: number;
    y: number;
    image: string;
}

export interface PlayerEntity extends Entity {
    user: PublicUser;
    targetX: number;
    targetY: number;
}

export interface TradingTableEntity extends Entity {
    tradingTable: null;
}
