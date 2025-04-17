/* eslint-disable max-depth */
import StaticMod from "./mods/static.ts";

const canvas = new OffscreenCanvas(0, 0);
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const mods = {
    static: new StaticMod({ canvas, ctx })
};

self.onmessage = async (e) => {
    const { imageBitmap, modifications, id, width = 300, height = 345 } = e.data;

    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    let filter: string = "";
    function addFilter(name: string, value: string) {
        if (filter) filter += " ";
        filter += `${name}(${value})`;
    }

    // before mods (draw image)

    if (modifications.inverted) {
        addFilter("invert", "1");
    }

    if (modifications.grayscale) {
        addFilter("grayscale", "1");
    }

    // if (modifications.corrupted) {
    //     addFilter("grayscale", "0");
    //     addFilter("saturate", "600%");
    //     addFilter("hue-rotate", "-45deg");
    //     addFilter("sepia", "0.4");
    //     addFilter("brightness", "1.3");
    // }

    // draw

    ctx.filter = filter;
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    ctx.filter = "none";

    // after mods (modify existing canvas)


    if (modifications.static) {
        mods.static.apply(0, width, height);
    }

    // finished //

    // static — Black and white noise texture overlaid
    // inverted — Inverted colors

    // ideas //

    // holographic - DO THIS ONE
    // corrupted
    // shifted
    // monotone
    // blurred
    // RETRO - pixelated
    // neon
    // fractured - cracked
    // glitch
    // UpsideDown
    // duotone
    // drained - desaturates
    // ancient - make it look old
    // glitched
    // withered - decayed look
    // radiant - bloom
    // shadowed - shadow overlay
    // warped - swirl
    // tinted - color overlay

    // ideas
    // mirrored — Flipped left/right and ghosted


    // void — Pure black background, sharp white edges

    // ethereal — Glow + transparency + high blur (ghostly)

    // celestial — Stars + slight orbiting particle halo

    // glitched — (you love it) heavy corruption + RGB shift + double image

    // inferno — Warm red/orange glow, heavy saturation

    // arcane — Purple+cyan duotone, mystical energy vibe

    // plasma — Bright outline with flowing color motion

    // toxic — Neon green tint, blurred edges

    // hologram — Light RGB split + low opacity flicker + glow

    // midnight — Cool-toned with low brightness + slight star specks

    // 3d effect - movie theater type

    const blob = await canvas.convertToBlob();
    const url = URL.createObjectURL(blob);

    self.postMessage({ url, id });
};
