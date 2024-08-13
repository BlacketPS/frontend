window.constructCDNUrl = (path) => `${import.meta.env.VITE_CDN_URL}${path}`;
window.errorImage = window.constructCDNUrl("/content/blooks/Error.png");