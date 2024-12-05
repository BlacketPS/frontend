window.constructCDNUrl = (path) => `${import.meta.env.VITE_MEDIA_PATH}${path}`;
window.errorImage = window.constructCDNUrl("/content/blooks/Error.png");

window.constants = {
    APPLE_DEVICE: /iPad|iPhone|iPod/.test(navigator.userAgent),
    emojis: []
};

window.lerp = (start: number, end: number, t: number) => Math.round((1 - t) * start * 100 + t * end * 100) / 100;

fetch(window.constructCDNUrl("/content/emojis.json"))
    .then((res) => res.json())
    .then((emojis) => {
        window.constants.emojis = emojis;
    });
