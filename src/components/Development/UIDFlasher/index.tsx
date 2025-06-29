import { useUser } from "@stores/UserStore/index";
import { useEffect, useRef, useState } from "react";

export default function UIDFlasher() {
    const { user } = useUser();
    if (!user) return null;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const textRef = useRef<HTMLDivElement | null>(null);

    // useEffect(() => {
    //     if (!user) return;

    //     const interval = setInterval(() => {
    //         const width = textRef.current?.offsetWidth || 200;
    //         const height = textRef.current?.offsetHeight || 100;

    //         const x = Math.random() * (window.innerWidth - width);
    //         const y = Math.random() * (window.innerHeight - height);

    //         setPosition({ x, y });
    //     }, 10);

    //     return () => clearInterval(interval);
    // }, [user]);

    // settimeout instead
    useEffect(() => {
        if (!user) return;

        let active = true;

        const set = () => {
            if (!active) return;

            const width = textRef.current?.offsetWidth || 200;
            const height = textRef.current?.offsetHeight || 100;

            const x = Math.random() * (window.innerWidth - width);
            const y = Math.random() * (window.innerHeight - height);

            setPosition({ x, y });

            setTimeout(set, 100);
        };

        set();

        return () => {
            active = false;
        };
    }, [user]);
    return (
        <div
            ref={textRef}
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                zIndex: 9999,
                fontSize: 50,
                pointerEvents: "none",
                textAlign: "center",
                color: "#00ff00",
                backgroundColor: "purple",
                padding: "4px 8px",
                fontWeight: "bold",
                fontFamily: "monospace",
                opacity: 0.015,
                mixBlendMode: "difference",
                userSelect: "none"
            }}>
            {user.username}
            <br />
            {user.id}
            <br />
            {user.email}
        </div>
    );

}
