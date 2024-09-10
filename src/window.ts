import { HTTPMethod } from "./fetch2";

const setStuff = () => {
    window.constructCDNUrl = (path) => `${import.meta.env.VITE_CDN_URL}${path}`;
    window.errorImage = window.constructCDNUrl("/content/blooks/Error.png");
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
