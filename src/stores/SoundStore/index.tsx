import { create } from "zustand";
import * as Tone from "tone";

import { SoundStore, Sound, DefinedSound } from "./soundStore.d";
import { useEffect } from "react";

const useSoundStore = create<SoundStore>((set, get) => {
    const sounds: Sound[] = [];

    return {
        sounds,

        getSound: async (id: string) => {
            const sound = get().sounds.find((s) => s.id === id);
            return sound?.player;
        },

        playSound: async (id: string) => {
            const sound = await get().getSound(id);
            if (!sound) return;

            await Tone.start();
            sound.start();
        },

        playSounds: async (ids: string[]) => {
            await Promise.all(ids.map((id) => get().playSound(id)));
        },

        stopSound: async (id: string) => {
            const sound = await get().getSound(id);
            if (!sound) return;

            sound.stop();
        },

        stopSounds: async (ids: string[]) => {
            await Promise.all(ids.map((id) => get().stopSound(id)));
        },

        stopAllSounds: async () => {
            await Promise.all(get().sounds.map((sound) => sound.player.stop()));
        },

        defineSounds: async (definedSounds: DefinedSound[]) => {
            const currentSounds = get().sounds;

            const newSounds = await Promise.all(
                definedSounds.map(async (definedSound) => {
                    if (currentSounds.find((s) => s.id === definedSound.id)) return null;

                    const player = new Tone.Player({
                        url: definedSound.url,
                        loop: definedSound.options?.loop ?? false,
                        volume: definedSound.options?.volume ?? 0
                    }).toDestination();

                    if (definedSound.options?.preload) await player.load(definedSound.url);

                    return { id: definedSound.id, player };
                })
            );

            set((s) => ({
                sounds: [
                    ...s.sounds,
                    ...newSounds.filter((s): s is Sound => s !== null)
                ]
            }));
        }
    };
});

export const useSound = () => {
    const soundStore = useSoundStore();


    useEffect(() => {
        const start = async () => {
            await Tone.start();
        };

        start();
    }, []);

    return {
        ...soundStore
    };
};