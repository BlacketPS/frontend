import { HTTPMethod } from "./fetch2";

const setStuff = () => {
    window.constructCDNUrl = (path) => `${import.meta.env.VITE_CDN_URL}${path}`;
    window.errorImage = window.constructCDNUrl("/content/blooks/Error.png");

    window.lerp = (start: number, end: number, t: number) => Math.round((1 - t) * start * 100 + t * end * 100) / 100;
};

await fetch(import.meta.env.VITE_CDN_URL + "/pixel.png", { method: HTTPMethod.GET })
    .then((response) => {
        if (!response.ok) import.meta.env.VITE_CDN_URL = import.meta.env.VITE_CDN_BACKUP_URL;

        setStuff();
    })
    .catch(() => {
        import.meta.env.VITE_CDN_URL = import.meta.env.VITE_CDN_BACKUP_URL;

        setStuff();
    });

await fetch(window.constructCDNUrl("/content/emojis.json"))
    .then((res) => res.json())
    .then((emojis) => {
        window.emojis = emojis;
    });
