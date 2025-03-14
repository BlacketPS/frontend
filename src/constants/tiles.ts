export interface Tile {
    id: string;
    width: number;
    height: number;
    image: string;
    chance?: number;
}

export const TILES: Tile[] = [
    { id: "grass-1", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-1.png"), chance: 0.1 },
    { id: "grass-2", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-2.png"), chance: 0.1 },
    { id: "grass-3", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-3.png"), chance: 0.1 },
    { id: "grass-4", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-4.png"), chance: 0.05 },
    { id: "grass-5", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-5.png"), chance: 0.01 },
    { id: "grass-6", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-6.png"), chance: 0.0025 },
    { id: "grass-7", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/grass-7.png"), chance: 0.02 },

    { id: "sand-1", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/sand-1.png"), chance: 0.1 },
    { id: "sand-2", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/sand-2.png"), chance: 0.01 },
    { id: "sand-3", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/sand-3.png"), chance: 0.02 },
    { id: "sand-4", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/sand-4.png"), chance: 0.05 },

    { id: "transition-corner-1", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-corner-1.png") },
    { id: "transition-corner-2", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-corner-2.png") },

    { id: "transition-horizontal-1", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-horizontal-1.png") },
    { id: "transition-horizontal-2", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-horizontal-2.png") },
    { id: "transition-horizontal-3", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-horizontal-3.png") },
    { id: "transition-horizontal-4", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-horizontal-4.png") },
    { id: "transition-horizontal-5", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-horizontal-5.png") },

    { id: "transition-vertical-1", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-1.png") },
    { id: "transition-vertical-2", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-2.png") },
    { id: "transition-vertical-3", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-3.png") },
    { id: "transition-vertical-4", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-4.png") },
    { id: "transition-vertical-5", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-5.png") },
    { id: "transition-vertical-6", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-6.png") },
    { id: "transition-vertical-7", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-7.png") },
    { id: "transition-vertical-8", width: 50, height: 50, image: window.constructCDNUrl("/content/trading-plaza/transition-vertical-8.png") },

    { id: "tree", width: 100, height: 100, image: window.constructCDNUrl("/content/trading-plaza/tree.png") },
    { id: "palm-tree", width: 100, height: 100, image: window.constructCDNUrl("/content/trading-plaza/palm-tree.png") },
    { id: "pine-tree", width: 100, height: 100, image: window.constructCDNUrl("/content/trading-plaza/pine-tree.png") },

    { id: "spawn", width: 500, height: 500, image: window.constructCDNUrl("/content/trading-plaza/spawn.png") },
    { id: "spawn-ring", width: 1000, height: 1000, image: window.constructCDNUrl("/content/trading-plaza/spawn-ring.png") },

    { id: "bridge", width: 200, height: 200, image: window.constructCDNUrl("/content/trading-plaza/bridge.png") }
];
