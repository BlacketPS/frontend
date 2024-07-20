import { Background, Loader } from "@components/index";

import { LoadingProps } from "./loading.d";

export default function Loading({ error, children }: LoadingProps) {
    return (
        <>
            <Background />

            <Loader
                motionless={true}
                image={!error ? "https://cdn.blacket.org/static/content/blooks/Console.gif" : "https://cdn.blacket.org/static/content/blooks/Error.png"}
                message={children}
            />
        </>
    );
}
