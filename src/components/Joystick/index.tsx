import { useRef, useState, useEffect } from "react";
import styles from "./joystick.module.scss";

import { JoystickProps } from "./joystick.d";

export default function Joystick({ onMove, onStop }: JoystickProps) {
    const baseRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const center = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const base = baseRef.current;
        if (!base) return;

        const checkTouchDevice = () => {
            if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
                base.style.display = "block";
            } else {
                base.style.display = "none";
            }
        };

        checkTouchDevice();

        window.addEventListener("resize", checkTouchDevice);

        return () => {
            window.removeEventListener("resize", checkTouchDevice);
        };
    }, []);

    useEffect(() => {
        const rect = baseRef.current?.getBoundingClientRect();

        if (rect) center.current = {
            x: rect.width / 2,
            y: rect.height / 2
        };
    }, []);

    useEffect(() => {
        const base = baseRef.current;
        if (!base) return;

        const handleTouchMove = (e: TouchEvent) => {
            if (!dragging || !baseRef.current) return;
            e.preventDefault();

            const touch = e.touches[0];
            const rect = baseRef.current.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const dx = x - center.current.x;
            const dy = y - center.current.y;

            const angle = Math.atan2(dy, dx);
            const dist = Math.min(Math.hypot(dx, dy), rect.width / 2 - 25);

            const offsetX = Math.cos(angle) * dist;
            const offsetY = Math.sin(angle) * dist;

            if (thumbRef.current)
                thumbRef.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

            if (onMove) onMove(angle);
        };

        base.addEventListener("touchmove", handleTouchMove);

        return () => {
            base.removeEventListener("touchmove", handleTouchMove);
        };
    }, [dragging, onMove]);

    const handleTouchStart = () => setDragging(true);

    const handleTouchEnd = () => {
        setDragging(false);
        if (thumbRef.current) thumbRef.current.style.transform = "translate(-50%, -50%)";
        if (onMove) onMove(0);
        if (onStop) onStop();
    };

    return (
        <div
            ref={baseRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={styles.base}
        >
            <div
                ref={thumbRef}
                className={styles.thumb}
            />
        </div>
    );
}
