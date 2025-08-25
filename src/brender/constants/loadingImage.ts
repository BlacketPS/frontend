import { urlToImage } from "@brender/utils";

export const loadingImage = await urlToImage(window.constructCDNUrl("/content/icons/loading.png")) as HTMLImageElement;
