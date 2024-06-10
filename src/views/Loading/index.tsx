import { Background, Loader } from "@components/index";

export default function Loading({ error, message }: { error?: boolean, message: string }) {
    return (
        <>
            <Background />

            <Loader
                motionless={true}
                image={!error ? "https://cdn.blacket.org/static/content/blooks/Console.gif" : "https://cdn.blacket.org/static/content/blooks/Error.png"}
                message={!error ? `Loading ${message}...` : `Failed to load ${message}.`}
            />
        </>
    );
}
