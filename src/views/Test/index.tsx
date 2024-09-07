import { useEffect, useRef, useState } from "react";
import styles from "./test.module.scss";

import { Input, LootTable, Map, ObjectType, Enemy, EnemyState, BlacketMath } from "./test.types";

export default function Test() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const player = {
        x: 0,
        y: 0,
        speed: 5
    };

    const enemies: Enemy[] = [];
    enemies.push({
        maxHealth: 10,
        health: 10,
        damage: 1,
        type: "boar",
        x: 100,
        y: 300,
        width: 30,
        height: 30,
        effects: [],
        state: EnemyState.ATTACK,
        angle: 0
    });
    // there u go!

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);


    const map: Map = {
        objects: [
            {
                type: ObjectType.INTERACTABLE,
                x: 50,
                y: 50,
                width: 50,
                height: 50
            }
        ],
        origin: {
            x: 0,
            y: 0
        }
    };

    // TODO: no movement=no background update

    const user = {
        isPressing: {
            [Input.UP]: false,
            [Input.DOWN]: false,
            [Input.LEFT]: false,
            [Input.RIGHT]: false
        }
    };

    useEffect(() => {
        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // animation
        const frame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // player render

            ctx.beginPath();
            const size = Math.floor(canvas.height/20);
            ctx.rect((canvas.width/2)-size/2, (canvas.height/2)-size/2, size*2, size*2);
            ctx.fillStyle = "blue";
            ctx.fill();

            // experiment with the enemy
            if(new BlacketMath().rectCollision((canvas.width/2), (canvas.height/2), size, size, 1, 1, 1, 1)) {
                // console.log("collision");
            }

            // enemy render

            for (let i = 0; i < enemies.length; i++) {
                ctx.beginPath();
                ctx.rect((enemies[i].x-enemies[i].width/2) - player.x, (enemies[i].y-enemies[i].height/2) - player.y, enemies[i].width*2, enemies[i].height*2);
                ctx.fillStyle="green";
                ctx.fill();
            }

            // map render

            for (let i = 0; i < map.objects.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.rect(map.objects[i].x - player.x, map.objects[i].y - player.y, 50, 50);
                ctx.fill();
            }

            window.requestAnimationFrame(frame);
        };

        window.requestAnimationFrame(frame);

        // controls
        document.addEventListener("keydown", (e) => user.isPressing[e.key as Input] = true);
        document.addEventListener("keyup", (e) => user.isPressing[e.key as Input] = false);

        const movementInterval = setInterval(() => {
            let dx = 0;
            let dy = 0;

            if (user.isPressing[Input.UP]) dy = -1;
            if (user.isPressing[Input.DOWN]) dy = 1;
            if (user.isPressing[Input.LEFT]) dx = -1;
            if (user.isPressing[Input.RIGHT]) dx = 1;

            const horizontal: boolean = user.isPressing[Input.RIGHT] || user.isPressing[Input.LEFT];
            const vertical: boolean = user.isPressing[Input.UP] || user.isPressing[Input.DOWN];

            if (horizontal && vertical) {
                dx *= 0.5;
                dy *= 0.5;
            }

            player.x += dx * player.speed;
            player.y += dy * player.speed;
        });

        return () => {
            document.removeEventListener("keydown", (e) => user.isPressing[e.key as Input] = true);
            document.removeEventListener("keyup", (e) => user.isPressing[e.key as Input] = false);

            clearInterval(movementInterval);
        };
    }, [mainCanvasRef]);

    useEffect(() => {
        if (!containerRef.current) return;

        // testing

        const TestLootTable = new LootTable({
            "Apple": 5,
            "Banana": 10,
            "Cherry": 1
        });

        console.log(TestLootTable.run());
        console.log(new BlacketMath().cage(0, 10));

        setWidth(containerRef.current.clientWidth);
        setHeight(containerRef.current.clientHeight);
    }, [containerRef]);

    // html

    return (
        <div className={styles.container} ref={containerRef}>
            <canvas
                ref={mainCanvasRef}
                className={styles.canvas}
                width={width}
                height={height}
            />
            <canvas
                ref={backgroundCanvasRef}
                className={styles.canvas}
                width={width}
                height={height}
            />
        </div>
    );
}
