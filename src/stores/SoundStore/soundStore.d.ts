import { Player } from "tone";

export interface Sound {
    id: string;
    player: Player;
}

export interface SoundOptions {
    loop?: boolean;
    volume?: number;
    preload?: boolean;
}

export interface DefinedSound {
    id: string;
    url: string;
    options?: SoundOptions;
}

export interface SoundStore {
    sounds: Sound[];

    getSound: (id: string) => Promise<Tone.Player | undefined>;
    playSound: (id: string) => Promise<void>;
    playSounds: (ids: string[]) => Promise<void>;
    stopSound: (id: string) => Promise<void>;
    stopSounds: (ids: string[]) => Promise<void>;
    stopAllSounds: () => Promise<void>;

    defineSounds: (definedSounds: DefinedSound[]) => Promise<void>;
}