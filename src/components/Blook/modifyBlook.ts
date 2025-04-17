const worker = new Worker(new URL("./modifyBlookWorker.ts", import.meta.url), { type: "module" });
let currentId = 0;

function generateId() {
    currentId += 1;

    return currentId;
}

const idMap: any = {};

worker.onmessage = (e) => {
    const { url, id: responseId } = e.data;
    if (!idMap[responseId]) return;

    idMap[responseId].resolve(url);
    delete idMap[responseId];

    // console.log(`Processed blook with id ${responseId}`);

};

worker.onerror = (e) => {
    const errorId = Object.keys(idMap).find((id) => idMap[id]?.reject);
    if (!errorId) return;

    idMap[errorId]?.reject(e);
    delete idMap[errorId];
};

export async function modifyBlook(
    blook: HTMLImageElement,
    dimensions: { width?: number; height?: number } = {},
    modifications: Partial<any>
): Promise<string> {
    if (!blook.crossOrigin) blook.crossOrigin = "anonymous";

    const imageBitmap = await createImageBitmap(blook);

    return new Promise((resolve, reject) => {
        const id = generateId();
        idMap[id] = { resolve, reject };

        worker.postMessage({
            id,
            imageBitmap,
            modifications,
            width: dimensions.width || 300,
            height: dimensions.height || 345
        });

        // console.log(`Processing blook with src ${blook.src} and id ${id}`);
    });
}
