export function useGenerateRegistration() {
    const generateRegistration = () => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.post("/api/auth/webauthn/generate-registration", {
        host: window.location.hostname
    })
        .then((res: Fetch2Response) => {
            resolve(res);
        })
        .catch(reject));

    return { generateRegistration };
}
