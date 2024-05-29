import { GenerateResponse } from "./useGenerate.d";

export function useGenerate() {
    const generate = () => new Promise<GenerateResponse>((resolve, reject) => window.fetch2.post("/api/auth/otp/generate", {})
        .then((res: GenerateResponse) => {
            resolve(res);
        })
        .catch(reject));

    return { generate };
}
