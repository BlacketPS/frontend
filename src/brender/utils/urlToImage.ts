const _cachedImages = new Map<string, HTMLImageElement>();

export const urlToImage = (url: string) => new Promise<HTMLImageElement>((resolve) => {
    if (_cachedImages.has(url)) return resolve(_cachedImages.get(url)!);

    const image = new Image();
    image.src = url;

    image.onload = () => {
        _cachedImages.set(url, image);

        resolve(image);
    };
});
