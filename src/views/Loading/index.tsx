import { Background, Loader } from "@components/index";

import { LoadingProps } from "./loading.d";

export default function Loading({ error, children }: LoadingProps) {
    return (
        <>
            <Background />

            <Loader
                motionless={true}
                image={!error ? window.constructCDNUrl("/content/blooks/Console.gif") : window.errorImage}
                message={children}
            />
        </>
    );
}
