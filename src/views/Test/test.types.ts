export enum Input {
    UP = "w",
    DOWN = "s",
    LEFT = "a",
    RIGHT = "d"
}

export interface Effect {
    type: string
    duration: number
    stack: number
}

export enum EnemyState {
    IDLE = 1,
    WANDER = 2,
    ATTACK = 3,
    FLEE = 4
}

export class BlacketMath {
    constructor() { }

    cage(min: number, max: number) {
        return Math.floor(min + Math.random() * (max - min + 1));
        // best code ever
    }
    angle(cx: number, cy: number, ex: number, ey: number) {
        const dy = ey - cy;
        const dx = ex - cx;
        let theta =  Math.atan2(dy, dx);
        theta *= 180 / Math.PI; // rads to degs
        return theta;
    }
    toRad(deg: number) {
        return deg*(Math.PI / 180);
    }
    toDeg(rad: number) {
        return rad*(180/Math.PI);
    }
    distance(x1: number, y1: number, x2: number, y2: number) {
        const a = x1 - x2;
        const b = y1 - y2;
        return Math.sqrt( a*a + b*b );
    }
    findPoint(cx: number, cy: number, ex: number, ey: number, quotient: number, diviser: number) {
        const inverse = diviser - quotient;
        const nx = ((inverse/diviser)*cx)+((quotient/diviser)*ex);
        const ny = ((inverse/diviser)*cy)+((quotient/diviser)*ey);
        return {
            x: nx,
            y: ny
        };
    }
    rectCollision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
        const touchLeft = x2+w2/2>=x1-w1/2;
        const touchRight = x1+w1/2>=x2-w2/2;
        const touchHorizontal = touchLeft||touchRight;

        const touchTop = y2+h2/2>=y1-h1/2;
        const touchBottom = y1+h1/2>=y2-h2/2;
         const touchVerticle = touchTop||touchBottom;
        // add other sides
        if(touchHorizontal&&touchVerticle) {
            return true;
        } else {
            return false;
        }
        // if any side is true then return true, else false
    }
}

export interface Enemy {
    maxHealth: number
    health: number
    damage: number
    type: string
    x: number
    y: number
    width: number
    height: number
    effects: Effect[]
    state: EnemyState,
    angle: number
}

export class LootTable {
    table: { [key: string]: number };

    constructor(data: { [key: string]: number }) {
        this.table = data;
    }

    run() {
        let total = 0;
        for (const i in this.table) {
            total += this.table[i];
        }
        let roll = Math.floor(Math.random() * total);
        let picked = null;

        for (const i in this.table) {
            const loot = i;

            const chance = this.table[i];

            if (roll < chance) {
                picked = loot;

                return picked;
            }

            roll -= chance;
        }
    }
}


export enum ObjectType {
    INTERACTABLE = 2,
    NPC = 3
}

export interface MapObject {
    type: ObjectType;

    x: number;
    y: number;

    width: number;
    height: number;

    interactable?: boolean;
    npc?: boolean;

    npcDialog?: string;

}

export interface Map {
    objects: MapObject[];
    origin: {
        x: number;
        y: number;
    };
}
