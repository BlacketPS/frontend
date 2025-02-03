window.constructCDNUrl = (path) => `${import.meta.env.VITE_MEDIA_PATH}${path}`;
window.errorImage = window.constructCDNUrl("/content/icons/error.png");

window.constants = {
    APPLE_DEVICE: /iPad|iPhone|iPod/.test(navigator.userAgent),
    emojis: []
};

document.getElementById("fa")!.innerHTML = `@import url("${window.constructCDNUrl("/font-awesome/css/all.min.css")}")`;

fetch(window.constructCDNUrl("/content/emojis.json"))
    .then((res) => res.json())
    .then((emojis) => {
        window.constants.emojis = emojis;
    });
