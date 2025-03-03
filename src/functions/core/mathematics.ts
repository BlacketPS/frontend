export function lerp(start: number, end: number, t: number): number {
    return (Math.round((1 - t) * start * 100 + t * end * 100) / 100) | 0;
}
