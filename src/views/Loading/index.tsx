import { Background, Loader } from "@components/index";

export default function Loading({ error = false, message }: { error?: boolean, message: string }) {
    document.title = `Loading | ${import.meta.env.VITE_INFORMATION_NAME}`;

    if (error) return (<>
        <Background />

        <Loader image="/content/blooks/Error.png" motionless={true} message={`Failed to load ${message}.`} />
    </>);

    return (<>
        <Background />

        <Loader image="/content/blooks/Console.gif" message={`Loading ${message}...`} />
    </>);
}
