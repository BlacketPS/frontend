window.constructCDNUrl = (path) => `${import.meta.env.VITE_MEDIA_PATH}${path}`;
window.errorImage = window.constructCDNUrl("/content/icons/error.png");

window.constants = {
    APPLE_DEVICE: /iPad|iPhone|iPod/.test(navigator.userAgent),
    emojis: []
};

window.lerp = (start: number, end: number, t: number) => Math.round((1 - t) * start * 100 + t * end * 100) / 100;

document.getElementById("fa")!.innerHTML = `@import url("${window.constructCDNUrl("/font-awesome/css/all.min.css")}")`;

fetch(window.constructCDNUrl("/content/emojis.json"))
    .then((res) => res.json())
    .then((emojis) => {
        window.constants.emojis = emojis;
    });
