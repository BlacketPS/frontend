export interface Tile {
    id: string;
    width: number;
    height: number;
    image: string;
    chance?: number;
}

export const TILES: Tile[] = [
    { id: "grass-1", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-1.png"), chance: 0.1 },
    { id: "grass-2", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-2.png"), chance: 0.005 },
    { id: "grass-3", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-3.png"), chance: 0.005 },
    { id: "grass-4", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-4.png"), chance: 0.005 },
    { id: "grass-5", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-5.png"), chance: 0.001 },
    { id: "grass-6", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-6.png"), chance: 0.0025 },
    { id: "spawn", width: 500, height: 500, image: window.constructCDNUrl("/content/trading-plaza/spawn.png") },
    { id: "spawn-ring", width: 1600, height: 1600, image: window.constructCDNUrl("/content/trading-plaza/spawn-ring.png") }
];
