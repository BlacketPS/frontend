import { useEffect } from "react";
import { useSound } from "@stores/SoundStore/index";

export default function SoundDefiner() {
    const { defineSounds } = useSound();

    useEffect(() => {
        defineSounds([
            { id: "click", url: "/sounds/click.mp3", options: { preload: true } },
            { id: "hover", url: "/sounds/hover.mp3", options: { preload: true } },
            { id: "notification", url: "/sounds/notification.mp3", options: { preload: true } }
        ]);
    }, [defineSounds]);

    return null;
}
