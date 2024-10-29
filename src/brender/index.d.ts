import { HTMLAttributes } from "react";
import { EntityType, PublicUser } from "@blacket/types";

export interface TextStyle {
    fontSize?: number;
    fontFamily?: string;
    textAlign?: "center" | "left" | "right";
    color?: string;
}

export interface BrenderCanvasRef {
    objects: CanvasObject[];
    entities: Entity[];
    camera: Camera;
    pressing: { [key: string]: boolean };
    mousePosition: { x: number; y: number };
    loadingImage: HTMLImageElement;
    isMouseOver(object: CanvasObject | Entity): boolean;
    createGenericEntity(entity: Entity): Entity;
    createPlayerEntity(entity: PlayerEntity): PlayerEntity;
    createObject(object: CanvasObject): CanvasObject;
    findEntity(id: string): Entity | undefined;
    findObject(id: string): CanvasObject | undefined;
    renderRect(x: number, y: number, w: number, h: number, color: string): void;
    renderText(text: string, x: number, y: number, style?: TextStyle, useCamera?: boolean): void;
    urlToImage(url: string): Promise<HTMLImageElement>;
    getWidth(): number;
    getHeight(): number;
}

export interface BrenderCanvasProps extends HTMLAttributes<HTMLCanvasElement> {
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    debug?: boolean;
}

export interface Camera {
    x: number;
    y: number;
    scale: number;
    targetScale: number;
    moveTo(x: number, y: number): void;
    moveBy(dx: number, dy: number): void;
    focusOn(entity: CanvasObject | Entity | PlayerEntity): void;
    zoom(amount: number): void;
}

export interface CanvasObject {
    id: string;
    x: number;
    y: number;
    z: number;
    width?: number;
    height?: number;
    image?: HTMLImageElement;
    destroy?: () => void;
    onClick?: (object: CanvasObject) => void;
    onFrame?: (object: CanvasObject, deltaTime: number) => void;
}

export interface Entity extends CanvasObject {
    type?: EntityType;
    targetX?: number;
    targetY?: number;
    targetWidth?: number;
    targetHeight?: number;
    targetEasingSpeed?: number;
    onFrame?: (entity: Entity, deltaTime: number) => void;
}

export interface PlayerEntity extends Entity {
    sitting?: boolean;
    user: PublicUser;
    onFrame?: (entity: PlayerEntity, deltaTime: number) => void;
}

export interface TradingTableEntity extends Entity {
    tradingTable: null;
}
