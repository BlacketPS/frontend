import { BrenderObject } from "@brender/index";
import { RarityAnimationType } from "@blacket/types";
import { HTMLAttributes } from "react";

export interface ParticleCanvasRef {
    start: () => void;
    stop: () => void;
    setColor: (color: string) => void;
    setAnimationType: (animationType: RarityAnimationType) => void;
    setImages: (images: string[]) => void;
    setParticleWidth: (width: number) => void;
    setParticleHeight: (height: number) => void;
    setParticleCount: (count: number) => void;
}

export interface ParticleCanvasProps extends HTMLAttributes<HTMLCanvasElement> {
    width?: number;
    height?: number;
    color?: string;
    animationType: RarityAnimationType,
    images: string[];
    particleWidth?: number;
    particleHeight?: number;
    particleCount?: number;
    speed?: number;
}

export enum ParticleType {
    CENTER,
    RIGHT_BOTTOM,
    LEFT_BOTTOM,
    RIGHT_SHOWER,
    LEFT_SHOWER,
    TOP,
    RIGHT_DIAMOND,
    LEFT_DIAMOND
}

export interface ParticleObject extends BrenderObject {
    vx?: number;
    vy?: number;
    gravity?: number;
    angVelocity?: number;
}
