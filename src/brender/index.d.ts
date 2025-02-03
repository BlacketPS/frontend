import { HTMLAttributes } from "react";
import { EntityType, PublicUser } from "@blacket/types";

export interface TextStyle {
    fontSize?: number;
    fontFamily?: string;
    textAlign?: "center" | "left" | "right";
    color?: string;
}

export interface DrawRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    useCamera?: boolean;
}

export interface DrawTextProps {
    text: string;
    x: number;
    y: number;
    style?: TextStyle;
    useCamera?: boolean;
}
export interface DrawImageProps {
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    blendMode?: GlobalCompositeOperation,
    opacity?: number
    useCamera?: boolean;
}

export interface BrenderCanvasRef {
    objects: BrenderObject[];
    entities: BrenderEntity[];
    camera: BrenderCamera;
    pressing: { [key: string]: boolean };
    mousePosition: { x: number; y: number };
    loadingImage: HTMLImageElement;
    isMouseOver(object: BrenderObject | BrenderEntity): boolean;
    createGenericEntity(entity: BrenderEntity): BrenderEntity;
    createPlayerEntity(entity: PlayerEntity): PlayerEntity;
    createObject(object: BrenderObject): BrenderObject;
    findEntity(id: string): BrenderEntity | undefined;
    findObject(id: string): BrenderObject | undefined;
    drawRect(rect: DrawRectProps): void
    drawText(text: DrawTextProps): void;
    drawImage(image: DrawImageProps): void;
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

export interface BrenderCamera {
    x: number;
    y: number;
    scale: number;
    targetScale: number;
    moveTo(x: number, y: number): void;
    moveBy(dx: number, dy: number): void;
    focusOn(entity: BrenderObject | BrenderEntity | PlayerEntity): void;
    zoom(amount: number): void;
}

export interface BrenderObject {
    id: string;
    x: number;
    y: number;
    z: number;
    width?: number;
    height?: number;
    image?: HTMLImageElement;
    imageBlendMode?: GlobalCompositeOperation;
    imageOpacity?: number;
    onClick?: (object: BrenderObject) => void;
    onFrame?: (object: BrenderObject, deltaTime: number) => void;

    destroy?: () => void;
}

export interface BrenderEntity extends BrenderObject {
    type?: EntityType;
    targetX?: number;
    targetY?: number;
    targetWidth?: number;
    targetHeight?: number;
    targetEasingSpeed?: number;
    onFrame?: (entity: BrenderEntity, deltaTime: number) => void;
}

export interface PlayerEntity extends BrenderEntity {
    sitting?: boolean;
    user: PublicUser;
    onFrame?: (entity: PlayerEntity, deltaTime: number) => void;
}

export interface TradingTableEntity extends BrenderEntity {
    tradingTable: null;
}
