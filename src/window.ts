import { HTTPMethod } from "./fetch2";

await window.fetch(import.meta.env.VITE_CDN_URL + "/pixel.png", { method: HTTPMethod.GET }).then((response) => {
    if (!response.ok) import.meta.env.VITE_CDN_URL = import.meta.env.VITE_CDN_BACKUP_URL;

    window.constructCDNUrl = (path) => `${import.meta.env.VITE_CDN_URL}${path}`;
    window.errorImage = window.constructCDNUrl("/content/blooks/Error.png");
});
