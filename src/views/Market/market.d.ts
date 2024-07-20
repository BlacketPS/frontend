import { HTMLAttributes } from "react";
import { Blook, MarketOpenPackDto, Pack } from "blacket-types";

export type ParticlesScene = Phaser.Scene & {
    initParticles: () => void;
    game: Game;
};

export type Config = {
    type: number;
    parent: string | HTMLDivElement | null;
    width: string;
    height: string;
    transparent: boolean;
    scale: { mode: number; autoCenter: number };
    physics: { default: string };
    scene: ParticlesScene;
};

export type GameState = {
    type: number;
    parent: string;
    width: string;
    height: string;
    transparent: boolean;
    scale: { mode: number; autoCenter: number; };
    physics: { default: string; };
    scene: ParticlesScene;
};

export enum BigButtonClickType {
    OPEN = 1,
    CLOSE = 2,
    NONE = 3
}

export interface SearchOptions {
    query: string;
    onlyPurchasable: boolean;
}

export interface CategoryProps extends HTMLAttributes<HTMLDivElement> {
    header: string;
    internalName: string;
}

export interface PackProps extends HTMLAttributes<HTMLDivElement> {
    pack: any;
}

export interface OpenPackModalProps {
    pack: Pack;
    userTokens: number;
    onYesButton: (dto: MarketOpenPackDto) => Promise;
}

export interface OpenPackContainerProps {
    opening: boolean;
    image: string;
}

export interface OpenPackBlookProps {
    blook: Blook;
    animate: boolean;
    isNew: boolean;
}
