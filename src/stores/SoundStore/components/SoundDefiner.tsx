import { useEffect } from "react";
import { gainToDb } from "tone";
import { useSound } from "@stores/SoundStore/index";

export default function SoundDefiner() {
    const { defineSounds } = useSound();

    useEffect(() => {
        defineSounds([

            { id: "pronounce", url: window.constructCDNUrl("/content/audio/sound/pronunciation.mp3") },
            { id: "angelic-chords", url: window.constructCDNUrl("/content/audio/sound/angelic-chords.mp3") },
            { id: "cha-ching", url: window.constructCDNUrl("/content/audio/sound/cha-ching.mp3") },
            { id: "party-popper", url: window.constructCDNUrl("/content/audio/sound/party-popper.mp3") },
            { id: "token-shower", url: window.constructCDNUrl("/content/audio/sound/token-shower.mp3") },
            { id: "bass-drop", url: window.constructCDNUrl("/content/audio/sound/bass-drop.mp3") },

            {
                id: "error", url: window.constructCDNUrl("/content/audio/sound/error.mp3"),
                options: { preload: true }
            },
            {
                id: "notification", url: window.constructCDNUrl("/content/audio/sound/notification.mp3"),
                options: { preload: true }
            },
            {
                id: "mention", url: window.constructCDNUrl("/content/audio/sound/mention.mp3"),
                options: { preload: true }
            },
            {
                id: "modal-open", url: window.constructCDNUrl("/content/audio/sound/modal-open.mp3"),
                options: { preload: true }
            },
            {
                id: "modal-close", url: window.constructCDNUrl("/content/audio/sound/modal-close.mp3"),
                options: { preload: true }
            },
            {
                id: "tick", url: window.constructCDNUrl("/content/audio/sound/tick.mp3"),
                options: { preload: true, volume: gainToDb(0.1) }
            }

        ]);
    }, [defineSounds]);

    return null;
}
