// @ts-nocheck i really dont want to define types for this file because its a pain in the ass and for some reason class doesn't exist in phaser as a type but it really does exist
// if someone can figure out how to get this to work with typescript please make a pull request

const { Class, GameObjects, Scene } = window.Phaser;

let data = {};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function particleType(e) {
    switch (e) {
        case "center": {
            const t = random(-115, -65);
            return {
                x: data.scene.cameras.main.worldView.width / 2,
                y: data.scene.cameras.main.worldView.height / 2,
                scale: random(.7, 1),
                angle: t,
                velocity: random(600, 750),
                gravity: 700,
                angVelocity: (t > -90 ? 1 : -1) * random(125, 175),
                lifespan: 2500
            };
        }
        case "right-bottom": return {
            x: data.scene.cameras.main.worldView.width,
            y: data.scene.cameras.main.worldView.height,
            scale: random(.7, 1),
            angle: random(-160, -110),
            velocity: random(600, 750),
            gravity: 500,
            angVelocity: random(-175, -125),
            lifespan: 2500
        };
        case "left-bottom": return {
            x: 0,
            y: data.scene.cameras.main.worldView.height,
            scale: random(.7, 1),
            angle: random(-70, -20),
            velocity: random(600, 750),
            gravity: 500,
            angVelocity: random(125, 175),
            lifespan: 2500
        };
        case "top": return {
            x: random(0, data.scene.cameras.main.worldView.width),
            y: -50,
            scale: random(.7, 1),
            angle: 90,
            velocity: random(0, 50),
            gravity: 700,
            angVelocity: random(-150, 150),
            lifespan: 2500
        };
        case "right-shower": return {
            x: data.scene.cameras.main.worldView.width,
            y: random(0, data.scene.cameras.main.worldView.height),
            scale: random(.7, 1),
            angle: random(-180, -130),
            velocity: random(600, 750),
            gravity: 500,
            angVelocity: random(-175, -125),
            lifespan: 2500
        };
        case "left-shower": return {
            x: 0,
            y: random(0, data.scene.cameras.main.worldView.height),
            scale: random(.7, 1),
            angle: random(-50, 0),
            velocity: random(600, 750),
            gravity: 500,
            angVelocity: random(125, 175),
            lifespan: 2500
        };
        case "right-diamond": {
            const a = random(0, data.scene.cameras.main.worldView.height);
            return {
                x: data.scene.cameras.main.worldView.width,
                y: a,
                scale: random(.7, 1),
                angle: a > data.scene.cameras.main.worldView.height / 2 ? -150 : -210,
                velocity: random(600, 750),
                gravity: 0,
                angVelocity: random(-175, -125),
                lifespan: 2500
            };
        }
        case "left-diamond": {
            const n = random(0, data.scene.cameras.main.worldView.height);
            return {
                x: 0,
                y: n,
                scale: random(.7, 1),
                angle: n > data.scene.cameras.main.worldView.height / 2 ? -30 : 30,
                velocity: random(600, 750),
                gravity: 0,
                angVelocity: random(125, 175),
                lifespan: 2500
            };
        }
        default: return {};
    }
}

function clamp(e, t, a) {
    return e < t ? t : e > a ? a : e;
}

let hue = 0,
    hueDirection = 1;
let lightness = 1,
    lightnessDirection = -1;

const particleClass = new Class({
    Extends: GameObjects.Image,
    initialize: function () {
        GameObjects.Image.call(this, data.scene, 0, 0, "particle-1");
        this.setDepth(3);
        this.lifespan = 0;
    },
    spawn: function (x, y, scale, velAngle, velSpeed, gravity, angle, lifespan, texture, color) {
        this.setTexture(texture);

        if (color === "iridescent") {
            if (hue > 360 || hue < 0) hueDirection *= -1;
            if (lightness <= 0.4 || lightness >= 1) lightnessDirection *= -1;

            hue += 0.06 * hueDirection;
            lightness += 0.005 * lightnessDirection;

            const color = Phaser.Display.Color.HSVToRGB(clamp(hue / 360, 0, 1), lightness, 1);
            this.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        } else if (color === "mystical") {
            if (lightness <= 0.5 || lightness >= 1) lightnessDirection *= -1;

            lightness += 0.005 * lightnessDirection;

            const color = Phaser.Display.Color.HSVToRGB(275.7 / 360, lightness, 1);
            this.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        } else if (color === "rainbow") {
            if (hue > 360 || hue < 0) hueDirection *= -1;
            hue += 0.06 * hueDirection;

            const color = Phaser.Display.Color.HSVToRGB(clamp(hue / 360, 0, 1), 1, 1);
            this.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        } else this.setTint(parseInt(color.replace("#", "").substring(0, 6), 16));
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.setScale(scale);
        if (parseInt(texture.replace("particle-", "") > 3)) this.setDisplaySize(30, 30);
        else this.setDisplaySize(25, 25);
        this.setDisplaySize(25, 25);
        this.targets = [];
        data.scene.physics.velocityFromAngle(velAngle, velSpeed, this.body.velocity);
        this.body.setGravityY(gravity);
        this.body.setAngularVelocity(angle);
        this.lifespan = lifespan;
    },
    update: function (t, s) {
        this.lifespan -= s;
        if (this.lifespan > 0) return;
        this.setActive(!1);
        this.setVisible(!1);
    }
});

export default class Particles extends Scene {
    constructor(rarity, color) {
        data = {};
        super();
        this.rarity = rarity;
        this.color = color;
    }

    preload() {
        this.load.image("particle-1", "https://cdn.blacket.org/static/content/particles/1.png", { width: 25, height: 25 });
        this.load.image("particle-2", "https://cdn.blacket.org/static/content/particles/2.png", { width: 25, height: 25 });
        this.load.image("particle-3", "https://cdn.blacket.org/static/content/particles/3.png", { width: 25, height: 25 });
        this.load.image("particle-4", "https://cdn.blacket.org/static/content/particles/4.png", { width: 30, height: 30 });
        this.load.image("particle-5", "https://cdn.blacket.org/static/content/particles/5.png", { width: 30, height: 30 });
        this.load.image("particle-6", "https://cdn.blacket.org/static/content/particles/6.png", { width: 30, height: 30 });
        this.load.image("particle-7", "https://cdn.blacket.org/static/content/particles/7.png", { width: 30, height: 30 });
    }

    create() {
        data.scene = this;
        data.rarity = 0;
        data.particles = this.physics.add.group({
            classType: particleClass,
            runChildUpdate: !0
        });
        this.nextParticle = 0;
        this.numExplosions = 0;
    }

    initParticles() {
        this.game.events.on("start-particles", (t) => {
            data.rarity = t;
            this.numExplosions = 1 === t ? 75 : 2 === t ? 100 : -1;
        });
    }

    update(e, t) {
        if (data.rarity && 0 !== this.numExplosions && (this.nextParticle -= t, this.nextParticle <= 0)) {
            switch (data.rarity) {
                case "UNCOMMON": {
                    for (let i = 0; i < 2; i++) {
                        const n = data.particles.get();
                        n && n.spawn.apply(n, Object.values(particleType("center")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }
                    break;
                }
                case "RARE": {
                    for (let o = 0; o < 2; o++) {
                        const r = data.particles.get();
                        r && r.spawn.apply(r, Object.values(particleType(o % 2 == 0 ? "left-bottom" : "right-bottom")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }
                    break;
                }

                case "EPIC": {
                    for (let s = 0; s < 2; s++) {
                        const i = data.particles.get();
                        i && i.spawn.apply(i, Object.values(particleType(s % 2 == 0 ? "left-shower" : "right-shower")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    break;
                }

                case "LEGENDARY": {
                    for (let l = 0; l < 3; l++) {
                        const c = data.particles.get();
                        c && c.spawn.apply(c, Object.values(particleType("top")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    break;
                }

                case "CHROMA": {
                    for (let u = 0; u < 3; u++) {
                        const d = data.particles.get();
                        d && d.spawn.apply(d, Object.values(particleType(u % 2 == 0 ? "left-diamond" : "right-diamond")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    break;
                }

                case "MYSTICAL": {
                    for (let v = 0; v < 3; v++) {
                        const b = data.particles.get();
                        b && b.spawn.apply(b, Object.values(particleType("top")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    for (let u = 0; u < 3; u++) {
                        const d = data.particles.get();
                        d && d.spawn.apply(d, Object.values(particleType(u % 2 == 0 ? "left-diamond" : "right-diamond")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    break;
                }

                case "IRIDESCENT": {
                    for (let h = 0; h < 2; h++) {
                        const m = data.particles.get();
                        m && m.spawn.apply(m, Object.values(particleType(h % 2 == 0 ? "left-bottom" : "right-bottom")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    for (let g = 0; g < 2; g++) {
                        const y = data.particles.get();
                        y && y.spawn.apply(y, Object.values(particleType(g % 2 == 0 ? "left-shower" : "right-shower")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    for (let v = 0; v < 3; v++) {
                        const b = data.particles.get();
                        b && b.spawn.apply(b, Object.values(particleType("top")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    for (let w = 0; w < 3; w++) {
                        const x = data.particles.get();
                        x && x.spawn.apply(x, Object.values(particleType(w % 2 == 0 ? "left-diamond" : "right-diamond")).concat(`particle-${randomInt(1, 8)}`, this.color));
                    }

                    break;
                }
            }

            this.nextParticle = 20;
            this.numExplosions > 0 && (this.numExplosions = Math.max(this.numExplosions - 1, 0));
        }
    }
}
