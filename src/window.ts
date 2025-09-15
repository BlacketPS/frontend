window.constructCDNUrl = (path: string) => `${import.meta.env.VITE_MEDIA_BACKUP_URL}${path}`;

fetch(import.meta.env.VITE_MEDIA_URL)
    .then((res) => {
        if (res.ok) return import.meta.env.VITE_MEDIA_URL;
        else return import.meta.env.VITE_MEDIA_BACKUP_URL;
    })
    .catch(() => import.meta.env.VITE_MEDIA_BACKUP_URL)
    .then((res) => {
        window.constructCDNUrl = (path: string) => `${res}${path}`;
    });

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
