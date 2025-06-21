export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export interface JoystickProps {
    onMove?: (angle: number) => void;
    onStop?: () => void;
}
