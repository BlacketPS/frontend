const _mediaCache = new Map<string, HTMLImageElement | HTMLVideoElement>();

export const urlToImage = (url: string): Promise<HTMLImageElement | HTMLVideoElement> => {
    if (_mediaCache.has(url)) return Promise.resolve(_mediaCache.get(url)!);

    if (/\.(mp4|webm)$/i.test(url)) { // is video
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;

        video.play().catch(() => { });

        _mediaCache.set(url, video);
        return Promise.resolve(video);
    } else return new Promise<HTMLImageElement>((resolve) => { // is image
        const image = new Image();
        image.src = url;

        image.onload = () => {
            _mediaCache.set(url, image);

            resolve(image);
        };
    });
};
