import { Background, Loader } from "@components/index";

export default function Loading({ error, message }: { error?: boolean, message: string }) {
    return (
        <>
            <Background />

            <Loader
                motionless={error}
                image={!error ? "/content/blooks/Console.gif" : "/content/blooks/Error.png"}
                message={!error ? `Loading ${message}...` : `Failed to load ${message}.`}
            />
        </>
    );
}
